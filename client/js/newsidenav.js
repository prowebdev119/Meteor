import {EmployeeProfileService} from './profile-service';
import {AccessLevelService} from './accesslevel-service';
import {ReactiveVar} from 'meteor/reactive-var';
import {ProductService} from "../product/product-service";
import {UtilityService} from "../utility-service";
import {CoreService} from '../js/core-service';
import {SideBarService} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
var CronJob = require('cron').CronJob;

let utilityService = new UtilityService();
let productService = new ProductService();
let sideBarService = new SideBarService();
Template.newsidenav.onCreated(function() {

    const templateObject = Template.instance();
    templateObject.includeDashboard = new ReactiveVar();
    templateObject.includeDashboard.set(false);
    templateObject.includeMain = new ReactiveVar();
    templateObject.includeMain.set(false);
    templateObject.includeInventory = new ReactiveVar();
    templateObject.includeInventory.set(false);
    templateObject.includeManufacturing = new ReactiveVar();
    templateObject.includeManufacturing.set(false);
    templateObject.includeAccessLevels = new ReactiveVar();
    templateObject.includeAccessLevels.set(false);
    templateObject.includeShipping = new ReactiveVar();
    templateObject.includeShipping.set(false);
    templateObject.includeStockTransfer = new ReactiveVar();
    templateObject.includeStockTransfer.set(false);
    templateObject.includeStockAdjustment = new ReactiveVar();
    templateObject.includeStockAdjustment.set(false);
    templateObject.includeStockTake = new ReactiveVar();
    templateObject.includeStockTake.set(false);
    templateObject.includeSales = new ReactiveVar();
    templateObject.includeSales.set(false);
    templateObject.includeExpenseClaims = new ReactiveVar();
    templateObject.includeExpenseClaims.set(false);
    templateObject.includeFixedAssets = new ReactiveVar();
    templateObject.includeFixedAssets.set(false);
    templateObject.includePurchases = new ReactiveVar();
    templateObject.includePurchases.set(false);


    templateObject.includePayments = new ReactiveVar();
    templateObject.includePayments.set(false);
    templateObject.includeContacts = new ReactiveVar();
    templateObject.includeContacts.set(false);
    templateObject.includeAccounts = new ReactiveVar();
    templateObject.includeAccounts.set(false);
    templateObject.includeReports = new ReactiveVar();
    templateObject.includeReports.set(false);
    templateObject.includeSettings = new ReactiveVar();
    templateObject.includeSettings.set(false);

    templateObject.includeSeedToSale = new ReactiveVar();
    templateObject.includeSeedToSale.set(false);
    templateObject.includeBanking = new ReactiveVar();
    templateObject.includeBanking.set(false);
    templateObject.includePayroll = new ReactiveVar();
    templateObject.includePayroll.set(false);

    templateObject.includePayrollClockOnOffOnly = new ReactiveVar();
    templateObject.includePayrollClockOnOffOnly.set(false);

    templateObject.includeTimesheetEntry = new ReactiveVar();
    templateObject.includeTimesheetEntry.set(false);
    templateObject.includeClockOnOff = new ReactiveVar();
    templateObject.includeClockOnOff.set(false);

    templateObject.isCloudSidePanelMenu = new ReactiveVar();
    templateObject.isCloudSidePanelMenu.set(false);
    templateObject.isCloudTopPanelMenu = new ReactiveVar();
    templateObject.isCloudTopPanelMenu.set(false);

    templateObject.includeAppointmentScheduling = new ReactiveVar();
    templateObject.includeAppointmentScheduling.set(false);

    templateObject.isBalanceSheet = new ReactiveVar();
    templateObject.isBalanceSheet.set(false);
    templateObject.isProfitLoss = new ReactiveVar();
    templateObject.isProfitLoss.set(false);
    templateObject.isAgedReceivables = new ReactiveVar();
    templateObject.isAgedReceivables.set(false);
    templateObject.isAgedReceivablesSummary = new ReactiveVar();
    templateObject.isAgedReceivablesSummary.set(false);
    templateObject.isProductSalesReport = new ReactiveVar();
    templateObject.isProductSalesReport.set(false);
    templateObject.isSalesReport = new ReactiveVar();
    templateObject.isSalesReport.set(false);
    templateObject.isSalesSummaryReport = new ReactiveVar();
    templateObject.isSalesSummaryReport.set(false);
    templateObject.isGeneralLedger = new ReactiveVar();
    templateObject.isGeneralLedger.set(false);
    templateObject.isTaxSummaryReport = new ReactiveVar();
    templateObject.isTaxSummaryReport.set(false);
    templateObject.isTrialBalance = new ReactiveVar();
    templateObject.isTrialBalance.set(false);
    templateObject.is1099Transaction = new ReactiveVar();
    templateObject.is1099Transaction.set(false);
    templateObject.isAgedPayables = new ReactiveVar();
    templateObject.isAgedPayables.set(false);
    templateObject.isAgedPayablesSummary = new ReactiveVar();
    templateObject.isAgedPayablesSummary.set(false);
    templateObject.isPurchaseReport = new ReactiveVar();
    templateObject.isPurchaseReport.set(false);
    templateObject.isPurchaseSummaryReport = new ReactiveVar();
    templateObject.isPurchaseSummaryReport.set(false);
    templateObject.isPrintStatement = new ReactiveVar();
    templateObject.isPrintStatement.set(false);

    $(document).ready(function() {
        var erpGet = erpDb();
        var LoggedDB = erpGet.ERPDatabase;
        var loc = FlowRouter.current().path;

    });

});
Template.newsidenav.onRendered(function() {
    var countObjectTimes = 0;
    let allDataToLoad = 70;
    let progressPercentage = 0;

    let templateObject = Template.instance();

    let employeeLoggedUserAccess = Session.get('ERPSolidCurrentUSerAccess');

    let isDashboard = Session.get('CloudDashboardModule');
    let isMain = Session.get('CloudMainModule');
    let isInventory = Session.get('CloudInventoryModule');
    let isManufacturing = Session.get('CloudManufacturingModule');
    let isAccessLevels = Session.get('CloudAccessLevelsModule');
    let isShipping = Session.get('CloudShippingModule');
    let isStockTransfer = Session.get('CloudStockTransferModule');
    let isStockAdjustment = Session.get('CloudStockAdjustmentModule');
    let isStockTake = Session.get('CloudStockTakeModule');
    let isSales = Session.get('CloudSalesModule');
    let isPurchases = Session.get('CloudPurchasesModule');
    let isExpenseClaims = Session.get('CloudExpenseClaimsModule');
    let isFixedAssets = Session.get('CloudFixedAssetsModule');

    let isPayments = Session.get('CloudPaymentsModule');
    let isContacts = Session.get('CloudContactsModule');
    let isAccounts = Session.get('CloudAccountsModule');
    let isReports = Session.get('CloudReportsModule');
    let isSettings = Session.get('CloudSettingsModule');

    let isSeedToSale = Session.get('CloudSeedToSaleModule');
    let isBanking = Session.get('CloudBankingModule');
    let isPayroll = Session.get('CloudPayrollModule');

    let isTimesheetEntry = Session.get('CloudTimesheetEntry');
    let isShowTimesheet = Session.get('CloudShowTimesheet');
    let isTimesheetCreate = Session.get('CloudCreateTimesheet');
    let isEditTimesheetHours = Session.get('CloudEditTimesheetHours');
    let isClockOnOff = Session.get('CloudClockOnOff');

    let isSidePanel = Session.get('CloudSidePanelMenu');
    let isTopPanel = Session.get('CloudTopPanelMenu');

    let isAppointmentScheduling = Session.get('CloudAppointmentSchedulingModule');
    let isCurrencyEnable = Session.get('CloudUseForeignLicence');
    let isAppointmentLaunch = Session.get('CloudAppointmentAppointmentLaunch');

    let launchAllocations = Session.get('CloudAppointmentAllocationLaunch');

    var erpGet = erpDb();
    var LoggedDB = erpGet.ERPDatabase;
    var LoggedUser = localStorage.getItem('mySession');



    templateObject.getSetSideNavFocus = function() {
        var currentLoc = FlowRouter.current().route.path;
        setTimeout(function() {
            var currentLoc = FlowRouter.current().route.path;

            if (currentLoc == "/dashboard") {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').addClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/appointments") || (currentLoc == "/appointmentlist") || (currentLoc == "/appointmenttimelist")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavappointment').addClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake ').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/accountsoverview") || (currentLoc == "/journalentrylist") ||
                (currentLoc == "/journalentrycard")) {
                $('#sidenavaccounts').addClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/bankingoverview") || (currentLoc == "/chequelist") ||
                (currentLoc == "/chequecard") || (currentLoc == "/reconciliation") ||
                (currentLoc == "/reconciliationlist") || (currentLoc == "/bankrecon") || (currentLoc == "/depositcard") || (currentLoc == "/depositlist")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').addClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/contactoverview") ||
                (currentLoc == "/employeelist") || (currentLoc == "/employeescard") ||
                (currentLoc == "/customerlist") || (currentLoc == "/customerscard") ||
                (currentLoc == "/supplierlist") || (currentLoc == "/supplierscard") ||
                (currentLoc == "/joblist")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment ').removeClass('active');
                $('#sidenavcontacts').addClass('active');
                $('#sidenavcrm ').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports ').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake ').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/crmoverview") || (currentLoc == "/tasklist")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').addClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/inventorylist") || (currentLoc == '/productview') ||
                (currentLoc == "/stockadjustmentcard") ||
                (currentLoc == "/stockadjustmentoverview") || (currentLoc == "/productlist")
              ||(currentLoc == "/stocktransfercard") || (currentLoc == "/stocktransferlist")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').addClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/paymentoverview") ||
                (currentLoc == "/customerawaitingpayments") || (currentLoc == "/customerpayment") ||
                (currentLoc == "/supplierawaitingpurchaseorder") || (currentLoc == "/supplierawaitingbills") ||
                (currentLoc == "/supplierpayment") || (currentLoc == "/paymentcard") ||
                (currentLoc == "/supplierpaymentcard")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').addClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if (currentLoc == "/receiptsoverview") {
                $('#sidenavreceipt').addClass('active');
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/purchasesoverview") ||
                (currentLoc == "/purchaseorderlist") || (currentLoc == "/purchaseordercard") ||
                (currentLoc == "/billlist") || (currentLoc == "/billcard") ||
                (currentLoc == "/creditlist") || (currentLoc == "/creditcard") ||
                (currentLoc == "/purchaseorderlistBO")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').addClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/allreports") ||
                (currentLoc == "/balancesheetreport") || (currentLoc == "/balancetransactionlist") ||
                (currentLoc == "/cashsummaryreport") || (currentLoc == "/profitlossreport") ||
                (currentLoc == "/agedreceivables") || (currentLoc == "/agedpayables") ||
                (currentLoc == "/trialbalancereport") || (currentLoc == "/1099report") ||
                (currentLoc == "/agedreceivablessummary") || (currentLoc == "/salesreport") ||
                (currentLoc == "/generalledger") || (currentLoc == "/trialbalance") ||
                (currentLoc == "/statementlist") || (currentLoc == "/purchasesreport") ||
                (currentLoc == "/productsalesreport") || (currentLoc == "/salessummaryreport") ||
                (currentLoc == "/taxsummaryreport") || (currentLoc == "/purchasesummaryreport") ||
                (currentLoc == "/agedpayablessummary")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports ').addClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/salesoverview") ||
                (currentLoc == "/quotecard") || (currentLoc == "/quoteslist") ||
                (currentLoc == "/salesordercard") || (currentLoc == "/salesorderslist") ||
                (currentLoc == "/invoicecard") || (currentLoc == "/refundcard") ||
                (currentLoc == "/invoicelist") || (currentLoc == "/refundlist") || (currentLoc == "/invoicelistBO")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').addClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/settings") ||
                (currentLoc == "/accesslevel") || (currentLoc == "/companyappsettings") || (currentLoc == "/organisationsettings") ||
                (currentLoc == "/taxratesettings") || (currentLoc == "/currenciesSettings") ||
                (currentLoc == "/departmentSettings") || (currentLoc == "/termsettings") ||
                (currentLoc == "/paymentmethodSettings")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord ').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').addClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/timesheet") || (currentLoc == "/adpapi") ||
                (currentLoc == "/squareapi") || (currentLoc == "/employeetimeclock") || (currentLoc == "/payrolloverview")) {
                  $('#sidenavaccounts').removeClass('active');
                  $('#sidenavbanking').removeClass('active');
                  $('#sidenavdashbaord').removeClass('active');
                  $('#sidenavappointment').removeClass('active');
                  $('#sidenavcontacts').removeClass('active');
                  $('#sidenavcrm').removeClass('active');
                  $('#sidenavinventory').removeClass('active');
                  $('#sidenavpayments').removeClass('active');
                  $('#sidenavpurchases').removeClass('active');
                  $('#sidenavreports').removeClass('active');
                  $('#sidenavreports').removeClass('active');
                  $('#sidenavsales').removeClass('active');
                  $('#sidenavsettings').removeClass('active');
                  $('#sidenavstocktake').removeClass('active');
                  $('#sidenavpayroll').addClass('active');
                  $('#sidenavseedtosale').removeClass('active');
                  $('#sidenavshipping').removeClass('active');
                  $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            } else if ((currentLoc == "/stsdashboard") || (currentLoc == "/stsplants") ||
                (currentLoc == "/stsharvests") || (currentLoc == "/stspackages") ||
                (currentLoc == "/ststransfers") || (currentLoc == "/stsoverviews") ||
                (currentLoc == "/stssettings")
            ) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment ').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm ').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake ').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').addClass('active');
                $('#sidenavshipping').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
            }else if ((currentLoc == "/vs1shipping")) {
                $('#sidenavaccounts').removeClass('active');
                $('#sidenavbanking').removeClass('active');
                $('#sidenavdashbaord').removeClass('active');
                $('#sidenavappointment').removeClass('active');
                $('#sidenavcontacts').removeClass('active');
                $('#sidenavcrm').removeClass('active');
                $('#sidenavinventory').removeClass('active');
                $('#sidenavpayments').removeClass('active');
                $('#sidenavpurchases').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavreports').removeClass('active');
                $('#sidenavsales').removeClass('active');
                $('#sidenavsettings').removeClass('active');
                $('#sidenavstocktake').removeClass('active');
                $('#sidenavpayroll').removeClass('active');
                $('#sidenavseedtosale').removeClass('active');
                $('#sidenavreceipt').removeClass('active');
                $('.collapse').collapse('hide');
                $('#sidenavshipping').addClass('active');
            }
        }, 50);
    }

    templateObject.getSetSideNavFocus();

    let sidePanelSettings = Session.get('sidePanelSettings');
    if (sidePanelSettings === "openNav") {
        $(".active_page_content").css("text-align", "right");
    } else {
        $(".active_page_content").css("text-align", "inherit");
    }

    if (isSidePanel) {
        $("html").addClass("hasSideBar");
        $("body").addClass("hasSideBar");
    }

    if (LoggedDB !== null) {
        if (isDashboard) {
            templateObject.includeDashboard.set(true);
        }
        if (isMain) {
            templateObject.includeMain.set(true);
        }
        if (isInventory) {
            templateObject.includeInventory.set(true);
        }
        if (isManufacturing) {
            templateObject.includeManufacturing.set(true);
        }
        if (isAccessLevels) {
            templateObject.includeAccessLevels.set(true);
        }
        if (isShipping) {
            templateObject.includeShipping.set(true);
        }
        if (isStockTransfer) {
            templateObject.includeStockTransfer.set(true);
        }

        if (isStockAdjustment) {
            templateObject.includeStockAdjustment.set(true);
        }
        if (isStockTake) {
            templateObject.includeStockTake.set(true);
        }
        if (isSales) {
            templateObject.includeSales.set(true);
        }
        if (isPurchases) {
            templateObject.includePurchases.set(true);
        }

        if (isExpenseClaims) {
            templateObject.includeExpenseClaims.set(true);
        }

        if (isFixedAssets) {
            templateObject.includeFixedAssets.set(true);
        }

        if (isPayments) {
            templateObject.includePayments.set(true);
        }

        if (isContacts) {
            templateObject.includeContacts.set(true);
        }

        if (isAccounts) {
            templateObject.includeAccounts.set(true);
        }

        if (isReports) {
            templateObject.includeReports.set(true);
        }

        if (isSettings) {
            templateObject.includeSettings.set(true);
        }

        if (isSeedToSale) {
            templateObject.includeSeedToSale.set(true);
        }

        if (isBanking) {
            templateObject.includeBanking.set(true);
        }

        if (isPayroll) {
            templateObject.includePayroll.set(true);
        }

        if (isTimesheetEntry) {
            templateObject.includeTimesheetEntry.set(true);
        }

        if (isClockOnOff) {
            templateObject.includeClockOnOff.set(true);
        }

        if (!(isTimesheetEntry) && !(isClockOnOff)) {
            templateObject.includePayroll.set(false);
        }

        if (!(isTimesheetEntry) && !(isShowTimesheet) && !(isTimesheetCreate) && !(isEditTimesheetHours) && (isClockOnOff)) {
            templateObject.includePayrollClockOnOffOnly.set(true);
            templateObject.includePayroll.set(false);
        }

        if (isAppointmentScheduling) {
            templateObject.includeAppointmentScheduling.set(true);
        }

        if (isSidePanel) {
            templateObject.isCloudSidePanelMenu.set(true);
            $("html").addClass("hasSideBar");
        }
        if (isTopPanel) {
            templateObject.isCloudTopPanelMenu.set(true);
        }
    }

    if ((employeeLoggedUserAccess) && (LoggedDB !== null)) {

    } else {
        if (currentLoc !== '/') {

            CloudUser.update({
                _id: Session.get('mycloudLogonID')
            }, {
                $set: {
                    userMultiLogon: false
                }
            });
        }

    }
    let sidePanelToggle = Session.get('sidePanelToggle');
    // if ((sidePanelToggle === '') || (!sidePanelToggle)) {
    //   Session.setPersistent('sidePanelToggle', "toggled");
    //  sidePanelToggle = Session.get('sidePanelToggle');
    // }

    if (launchAllocations) {
      $('#allocationModal').css('dispay','none');
      setTimeout(function () {
          $('#allocationModal').addClass('killAllocationPOP');
      }, 800);

    }

    let isGreenTrack = Session.get('isGreenTrack');
    let loggedUserEventFired = Session.get('LoggedUserEventFired');
    if(loggedUserEventFired){
    $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
    $('.headerprogressbar').addClass('headerprogressbarShow');
    $('.headerprogressbar').removeClass('headerprogressbarHidden');

    getVS1Data('Tvs1charts').then(function(dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getTvs1charts().then(function(data) {
            addVS1Data('Tvs1charts', JSON.stringify(data));
        }).catch(function(err) {

        });
      }
    });
    getVS1Data('Tvs1dashboardpreferences').then(function(dataObject) {
      if (dataObject.length == 0) {
        sideBarService.getTvs1dashboardpreferences().then(function(data) {
            addVS1Data('Tvs1dashboardpreferences', JSON.stringify(data));
        }).catch(function(err) {

        });
      }
    });


    getVS1Data('TAppUser').then(function(dataObject) {
        if (dataObject.length == 0) {
          $('#headerprogressLabelFirst').css('display','block');
          sideBarService.getCurrentLoggedUser().then(function(data) {
            countObjectTimes++;
            progressPercentage = (countObjectTimes * 100) / allDataToLoad;
            $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
            //$(".progressBarInner").text("App User "+Math.round(progressPercentage)+"%");
            $(".progressBarInner").text(Math.round(progressPercentage)+"%");
            $(".progressName").text("App User ");
            if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').addClass('headerprogressbarShow');
                $('.headerprogressbar').removeClass('headerprogressbarHidden');
              }

            }else if(Math.round(progressPercentage) >= 100){
                $('.checkmarkwrapper').removeClass("hide");
              setTimeout(function() {
                if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                  $('.headerprogressbar').removeClass('headerprogressbarShow');
                  $('.headerprogressbar').addClass('headerprogressbarHidden');
                }else{
                  $('.headerprogressbar').removeClass('headerprogressbarShow');
                  $('.headerprogressbar').addClass('headerprogressbarHidden');
                }

              }, 1000);
            }
              //localStorage.setItem('VS1TAppUserList', JSON.stringify(data) || '');
              addVS1Data('TAppUser', JSON.stringify(data));
              $("<span class='process'>App User Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
          }).catch(function(err) {
            $('.process').addClass('killProgressBar');
            if (launchAllocations) {
              setTimeout(function () {
              $('.allocationModal').removeClass('killAllocationPOP');
            }, 800);
            }
          });
        } else {
            let getTimeStamp = dataObject[0].timestamp.split(' ');
            if (getTimeStamp) {
                if (loggedUserEventFired) {
                    if (getTimeStamp[0] != currenctTodayDate) {
                        sideBarService.getCurrentLoggedUser().then(function(data) {
                          addVS1Data('TAppUser', JSON.stringify(data));
                        }).catch(function(err) {
                          $('.process').addClass('killProgressBar');
                          if (launchAllocations) {
                            setTimeout(function () {
                            $('.allocationModal').removeClass('killAllocationPOP');
                          }, 800);
                          }
                        });
                        $('.loadingbar').css('width', 100 + '%').attr('aria-valuenow', 100);
                        $(".headerprogressLabel").text("All Your Information Loaded");
                        $(".progressBarInner").text(""+Math.round(100)+"%");
                        $('.checkmarkwrapper').removeClass("hide");
                        $('.process').addClass('killProgressBar');
                        if (launchAllocations) {
                          setTimeout(function () {
                          $('.allocationModal').removeClass('killAllocationPOP');
                        }, 800);
                        }
                        setTimeout(function() {
                        $('.headerprogressbar').removeClass('headerprogressbarShow');
                        $('.headerprogressbar').addClass('headerprogressbarHidden');
                        $('.headerprogressbar').addClass('killProgressBar');
                        if (launchAllocations) {
                          setTimeout(function () {
                          $('.allocationModal').removeClass('killAllocationPOP');
                        }, 800);
                        }
                       }, 3000);
                    }else{
                      $('.loadingbar').css('width', 100 + '%').attr('aria-valuenow', 100);
                      $(".headerprogressLabel").text("All Your Information Loaded");
                      $(".progressBarInner").text(""+Math.round(100)+"%");
                      $('.checkmarkwrapper').removeClass("hide");
                      $('.process').addClass('killProgressBar');
                      if (launchAllocations) {
                        setTimeout(function () {
                        $('.allocationModal').removeClass('killAllocationPOP');
                      }, 800);
                      }
                      setTimeout(function() {
                      $('.headerprogressbar').removeClass('headerprogressbarShow');
                      $('.headerprogressbar').addClass('headerprogressbarHidden');
                      $('.headerprogressbar').addClass('killProgressBar');
                      if (launchAllocations) {
                        setTimeout(function () {
                        $('.allocationModal').removeClass('killAllocationPOP');
                      }, 800);
                      }
                     }, 3000);
                    }
                }
            }
        }
    }).catch(function(err) {
      sideBarService.getCurrentLoggedUser().then(function(data) {
        countObjectTimes++;
        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
        //$(".progressBarInner").text("App User "+Math.round(progressPercentage)+"%");
        $(".progressBarInner").text(Math.round(progressPercentage)+"%");
        $(".progressName").text("App User ");
        if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          }else{
            $('.headerprogressbar').addClass('headerprogressbarShow');
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          }

        }else if(Math.round(progressPercentage) >= 100){
            $('.checkmarkwrapper').removeClass("hide");
          setTimeout(function() {
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarShow');
              $('.headerprogressbar').addClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').removeClass('headerprogressbarShow');
              $('.headerprogressbar').addClass('headerprogressbarHidden');
            }

          }, 1000);
        }
          //localStorage.setItem('VS1TAppUserList', JSON.stringify(data) || '');
          addVS1Data('TAppUser', JSON.stringify(data));
          $("<span class='process'>App User Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function(err) {
        $('.process').addClass('killProgressBar');
        if (launchAllocations) {
          setTimeout(function () {
          $('.allocationModal').removeClass('killAllocationPOP');
        }, 800);
        }
      });
    });
  }else{
    setTimeout(function () {
    $('.allocationModal').removeClass('killAllocationPOP');
      $('.headerprogressbar').addClass('headerprogressbarHidden');
    }, 800);
  }



    if (isGreenTrack) {
        $(".navbar").css("background-color", "#00a969");


        $(".collapse").css("background-color", "#3ddc97");
        $(".show").css("background-color", "#3ddc97");
        $("#collapse-0").css("background-color", "#3ddc97");
        $("#collapse-1").css("background-color", "#3ddc97");
        $("#collapse-2").css("background-color", "#3ddc97");
        $("#collapse-3").css("background-color", "#3ddc97");
        $("#collapse-4").css("background-color", "#3ddc97");
        $("#collapse-5").css("background-color", "#3ddc97");
        $("#collapse-6").css("background-color", "#3ddc97");
        $("#collapse-7").css("background-color", "#3ddc97");
        $("#collapse-8").css("background-color", "#3ddc97");
        $("#collapse-9").css("background-color", "#3ddc97");
        $("#collapse-10").css("background-color", "#3ddc97");
        $("#collapse-11").css("background-color", "#3ddc97");
        $("#collapse-12").css("background-color", "#3ddc97");

        $('.container-fluid .fa-bars').css("color", "#3ddc97");
        $('.btn-link').css("color", "#3ddc97");
        $('.input-group-append .btn-primary').css("background-color", "#3ddc97");
        $('.input-group-append .btn-primary').css("border-color", "#3ddc97");

        $(document).ready(function() {
            let checkGreenTrack = Session.get('isGreenTrack') || false;
            if (checkGreenTrack) {
                document.title = 'GreenTrack';
                $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/greentrackIcon.png">');
            } else {
                document.title = 'VS1 Cloud';
                $('head').append('<link rel="icon" type="image/png" sizes="16x16" href="icons/favicon-16x16.png">');
            }

        });
    }

    let currentDate = new Date();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();
    let month = (currentDate.getMonth() + 1);
    let days = currentDate.getDate();

    if ((currentDate.getMonth()+1) < 10) {
        month = "0" + (currentDate.getMonth() + 1);
    }

    if (currentDate.getDate() < 10) {
        days = "0" + currentDate.getDate();
    }
    let currenctTodayDate = currentDate.getFullYear() + "-" + month + "-" + days;



    if (sidePanelToggle) {
        if (sidePanelToggle === "toggled") {
            $("#sidenavbar").addClass("toggled");
        } else {
            $("#sidenavbar").removeClass("toggled");
        }
    }
    var splashArrayProd = new Array();

    var currentBeginDate = new Date();
    var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
    let fromDateMonth = (currentBeginDate.getMonth() + 1);

    let fromDateDay = currentBeginDate.getDate();
    if ((currentBeginDate.getMonth()+1) < 10) {
        fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
    } else {
        fromDateMonth = (currentBeginDate.getMonth() + 1);
    }


    if (currentBeginDate.getDate() < 10) {
        fromDateDay = "0" + currentBeginDate.getDate();
    }
    var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
    let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");


    templateObject.getAllAccountsData = function() {
        sideBarService.getAccountListVS1().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Accounts ");

          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }

            //localStorage.setItem('VS1AccountList', JSON.stringify(data) || '');
            addVS1Data('TAccountVS1', JSON.stringify(data));
            $("<span class='process'>Accounts Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");

        }).catch(function(err) {

        });
    }

    templateObject.getAllProductData = function() {
        sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Products "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Products ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TProductVS1', JSON.stringify(data));
            $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllProductServiceData = function() {
        sideBarService.getProductServiceListVS1(initialBaseDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Non-Inventory Products "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Non-Inventory Products ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TProductWeb', JSON.stringify(data));
            $("<span class='process'>Non-Inventory Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllCustomersData = function() {
        sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Customers "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Customers ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1CustomerList', JSON.stringify(data) || '');
            addVS1Data('TCustomerVS1', JSON.stringify(data));
            $("<span class='process'>Customers Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllSuppliersData = function() {
        sideBarService.getAllSuppliersDataVS1(initialBaseDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Suppliers "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Suppliers ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1SupplierList', JSON.stringify(data) || '');
            addVS1Data('TSupplierVS1', JSON.stringify(data));
            $("<span class='process'>Suppliers Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllTaxCodeData = function() {
        sideBarService.getTaxRateVS1().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Tax Code "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Tax Code ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TaxCodeList', JSON.stringify(data) || '');
            addVS1Data('TTaxcodeVS1', JSON.stringify(data));
            $("<span class='process'>Tax Codes Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }


    templateObject.getAllTermsData = function() {
        sideBarService.getTermsVS1().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Terms "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Terms ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TermsList', JSON.stringify(data) || '');
            addVS1Data('TTermsVS1', JSON.stringify(data));
            $("<span class='process'>Terms Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllDepartmentData = function() {
        sideBarService.getDepartment().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Departments "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Departments ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1DepartmentList', JSON.stringify(data) || '');
            addVS1Data('TDeptClass', JSON.stringify(data));
            $("<span class='process'>Departments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllCurrencyData = function() {
        sideBarService.getCurrencies().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Currency "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Currency ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1CurrencyList', JSON.stringify(data) || '');
            addVS1Data('TCurrency', JSON.stringify(data));
            $("<span class='process'>Currencies Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getTCountriesData = function() {
        sideBarService.getCountry().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Countries "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Countries ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TCountries', JSON.stringify(data));
            $("<span class='process'>Countries Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getTPaymentMethodData = function() {
        sideBarService.getPaymentMethodDataVS1().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Payment Method "+valeur+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Payment Method ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TPaymentMethod', JSON.stringify(data));
            $("<span class='process'>Payment Methods Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getTClientTypeData = function() {
        sideBarService.getClientTypeData().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Client Type "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Client Type ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TClientType', JSON.stringify(data));
            $("<span class='process'>Client Types Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllLeadStatusData = function() {
        sideBarService.getAllLeadStatus().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Lead Status Type "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Lead Status Type ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1LeadStatusList', JSON.stringify(data) || '');
            addVS1Data('TLeadStatusType', JSON.stringify(data));
            $("<span class='process'>Statuses Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllShippingMethodData = function() {
        sideBarService.getShippingMethodData().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Shipping Method "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Shipping Method ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1ShippingMethodList', JSON.stringify(data) || '');
            addVS1Data('TShippingMethod', JSON.stringify(data));
            $("<span class='process'>Shipping Methods Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllAccountTypeData = function() {
        sideBarService.getAccountTypesToAddNew().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Account Type "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Account Type ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1AccountTypeList', JSON.stringify(data) || '');
            addVS1Data('TAccountType', JSON.stringify(data));
            $("<span class='process'>Account Types Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllERPFormData = function() {
        sideBarService.getCloudTERPForm().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Account Type "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Access Level Forms ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1AccountTypeList', JSON.stringify(data) || '');
            addVS1Data('TERPForm', JSON.stringify(data));
            $("<span class='process'>Access Level Forms Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllEmployeeFormAccessDetailData = function() {
        sideBarService.getEmpFormAccessDetail().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Account Type "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Employee Access Forms ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1AccountTypeList', JSON.stringify(data) || '');
            addVS1Data('TEmployeeFormAccessDetail', JSON.stringify(data));
            $("<span class='process'>Employee Access Forms Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllERPCombinedContactsData = function() {
        sideBarService.getAllContactCombineVS1(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Contacts "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Contacts ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1ERPCombinedContactsList', JSON.stringify(data) || '');
            addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
            $("<span class='process'>Contacts Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllEmployeeData = function() {
        sideBarService.getAllEmployees(initialBaseDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Employee "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Employee ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1EmployeeList', JSON.stringify(data) || '');
            addVS1Data('TEmployee', JSON.stringify(data));
            $("<span class='process'>Employees Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllJournalEntryLineData = function() {
        sideBarService.getAllJournalEnrtryLinesList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Journal Entry Lines "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Journal Entry Lines ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1JournalEntryLineList', JSON.stringify(data) || '');
            addVS1Data('TJournalEntryLines', JSON.stringify(data));
            $("<span class='process'>Journal Entries Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getTJournalEntryListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Journal Entry List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
            addVS1Data('TJournalEntryList', JSON.stringify(data));
            $("<span class='process'>Journal Entry List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllBankAccountReportData = function() {

        sideBarService.getAllBankAccountDetails(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Bank Account Report ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
            addVS1Data('TBankAccountReport', JSON.stringify(data));
            $("<span class='process'>Bank Account Reports Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllTTransactionListReportData = function() {
        // sideBarService.getTTransactionListReport('').then(function(data) {
        //     addVS1Data('TTransactionListReport',JSON.stringify(data));
        // }).catch(function(err) {
        //
        // });
    }

    templateObject.getAllInvoiceListData = function() {
        // sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function(data) {
        //   countObjectTimes++;
        //   progressPercentage = (countObjectTimes * 100) / allDataToLoad;
        //   $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
        //   //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
        //   $(".progressBarInner").text(Math.round(progressPercentage)+"%");
        //   $(".progressName").text("Invoice ");
        //   if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
        //     if($('.headerprogressbar').hasClass("headerprogressbarShow")){
        //       $('.headerprogressbar').removeClass('headerprogressbarHidden');
        //     }else{
        //       $('.headerprogressbar').addClass('headerprogressbarShow');
        //       $('.headerprogressbar').removeClass('headerprogressbarHidden');
        //     }
        //
        //   }else if(Math.round(progressPercentage) >= 100){
        //       $('.checkmarkwrapper').removeClass("hide");
        //     setTimeout(function() {
        //       if($('.headerprogressbar').hasClass("headerprogressbarShow")){
        //         $('.headerprogressbar').removeClass('headerprogressbarShow');
        //         $('.headerprogressbar').addClass('headerprogressbarHidden');
        //       }else{
        //         $('.headerprogressbar').removeClass('headerprogressbarShow');
        //         $('.headerprogressbar').addClass('headerprogressbarHidden');
        //       }
        //
        //     }, 1000);
        //   }
        //     //localStorage.setItem('VS1TInvoiceList', JSON.stringify(data) || '');
        //     addVS1Data('TInvoiceEx', JSON.stringify(data));
        //     $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        // }).catch(function(err) {
        //
        // });

        sideBarService.getAllTInvoiceListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Invoice List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TInvoiceList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Invoice List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllRefundListData = function() {
        sideBarService.getAllRefundList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Refund Sale "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Refunds ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TRefundSale', JSON.stringify(data));
            $("<span class='process'>Refunds Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllTRefundSaleListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Refund List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TRefundSaleList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Refund List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllBackOrderInvoicetData = function() {
        sideBarService.getAllBackOrderInvoiceList(initialDataLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text(" Invoice BO "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Invoice BO ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TInvoiceBackOrder',JSON.stringify(data));
            $("<span class='process'>Invoice BO Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllTSalesBackOrderReportData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Sales BO Report");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TSalesBackOrderReport', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Sales BO Report Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
     }

    templateObject.getAllSalesOrderExListData = function() {
        sideBarService.getAllSalesOrderList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Sales Order "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Sales Order ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TSalesOrderEx', JSON.stringify(data));
            $("<span class='process'>Sales Orders Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllInvoiceListNonBOData = function() {
        // sideBarService.getAllInvoiceListNonBO(initialDataLoad,0).then(function(data) {
        //     //localStorage.setItem('VS1TInvoiceNonBackOrderList', JSON.stringify(data) || '');
        //     addVS1Data('TInvoiceNonBackOrder',JSON.stringify(data));
        // }).catch(function(err) {
        //
        // });
    }

    templateObject.getAllBOInvoiceListData = function() {
        // sideBarService.getAllBOInvoiceList(initialDataLoad,0).then(function(data) {
        //     //localStorage.setItem('VS1BackOrderSalesListList', JSON.stringify(data) || '');
        //     addVS1Data('BackOrderSalesList',JSON.stringify(data));
        // }).catch(function(err) {
        //
        // });
    }

    templateObject.getAllTPurchaseOrderData = function() {
        sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Purchase Order ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TPurchaseOrderList', JSON.stringify(data) || '');
            addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
            $("<span class='process'>Purchase Orders Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllTPurchaseOrderListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Purchase Order List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TPurchaseOrderList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Purchase Order List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllTReconcilationData = function() {

        sideBarService.getAllReconcilationList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Reconciliation ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TReconciliation', JSON.stringify(data));
            $("<span class='process'>Reconciliations Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllTReconcilationListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Reconciliation List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TReconciliationList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Reconciliation List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllTbillReportData = function() {

        sideBarService.getAllPurchaseOrderListAll(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bill Report "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Bill Report ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TbillReport', JSON.stringify(data) || '');
            addVS1Data('TbillReport', JSON.stringify(data));
            $("<span class='process'>Bill Reports Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllAwaitingSupplierPaymentData = function() {

        sideBarService.getAllAwaitingSupplierPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Awaiting Supplier Payment "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Awaiting Supplier Payment ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TbillReport', JSON.stringify(data) || '');
            addVS1Data('TAwaitingSupplierPayment', JSON.stringify(data));
            $("<span class='process'>Awaiting Supplier Payments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllAwaitingCustomerPaymentData = function() {

        sideBarService.getAllAwaitingCustomerPayment(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Awaiting Supplier Payment "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Awaiting Customer Payment ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TbillReport', JSON.stringify(data) || '');
            addVS1Data('TAwaitingCustomerPayment', JSON.stringify(data));
            $("<span class='process'>Awaiting Customer Payments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllTChequeData = function() {
        sideBarService.getAllChequeList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Cheque "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text(chequeSpelling);
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TChequeList', JSON.stringify(data) || '');
            addVS1Data('TCheque', JSON.stringify(data));
            $("<span class='process'>"+chequeSpelling+" Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllChequeListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text(chequeSpelling+" List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TChequeList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'> "+chequeSpelling+" List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllTProductStocknSalePeriodReportData = function() {
        // var currentBeginDate = new Date();
        // var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
        // let fromDateMonth = (currentBeginDate.getMonth() + 1);
        // let fromDateDay = currentBeginDate.getDate();
        // fromDateMonth
        // if ((currentBeginDate.getMonth()+1) < 10) {
        //     fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
        // } else {
        //     fromDateMonth = (currentBeginDate.getMonth() + 1);
        // }
        //
        // if (currentBeginDate.getDate() < 10) {
        //     fromDateDay = "0" + currentBeginDate.getDate();
        // }
        // var fromDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
        // let prevMonth11Date = (moment().subtract(6, 'months')).format("YYYY-MM-DD");
        //sideBarService.getProductStocknSaleReportData(prevMonth11Date, fromDate).then(function(data) {
        sideBarService.getProductStocknSaleReportData(prevMonth11Date, toDate, false).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Product Stock & Sale Period Report "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Product Stock & Sale Period Report ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TProductStocknSalePeriodReport', JSON.stringify(data));
            $("<span class='process'>Product Stock & Sales Reports Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllAppUserData = function() {
        sideBarService.getCurrentLoggedUser().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("App User "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("App User ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TAppUserList', JSON.stringify(data) || '');
            addVS1Data('TAppUser', JSON.stringify(data));
            $("<span class='process'>App User Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllTJobVS1Data = function() {
        sideBarService.getAllJobssDataVS1(initialBaseDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Job "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Job ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TJobVS1List', JSON.stringify(data) || '');
            addVS1Data('TJobVS1', JSON.stringify(data));
            $("<span class='process'>Jobs Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllTStockAdjustEntryData = function() {
        if(isStockAdjustment){
        sideBarService.getAllStockAdjustEntry(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Stock Adjust Entry "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Stock Adjust Entry ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TStockAdjustEntry', JSON.stringify(data));
            $("<span class='process'>Stock Adjustment Entries Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
      }else{
        allDataToLoad = allDataToLoad - 1;
      }
    }

    templateObject.getAllTStockTransferEntryData = function() {
      if(isStockTransfer){
        sideBarService.getAllStockTransferEntry(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Stock Transfer Entry "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Stock Transfer Entry ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TStockTransferEntry', JSON.stringify(data));
            $("<span class='process'>Stock Transfer Entries Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
      }else{
        allDataToLoad = allDataToLoad - 1;
      }
    }

    templateObject.getAllTQuoteData = function() {
        sideBarService.getAllQuoteList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Quote "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Quote ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TQuoteList', JSON.stringify(data) || '');
            addVS1Data('TQuote', JSON.stringify(data));
            $("<span class='process'>Quotes Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllTQuoteListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Quote List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TQuoteList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Quote List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllTsalesOrderNonBackOrderData = function() {
        // sideBarService.getAllSalesOrderListNonBO().then(function(data) {
        //     //localStorage.setItem('VS1TsalesOrderNonBackOrderList', JSON.stringify(data) || '');
        //     addVS1Data('TsalesOrderNonBackOrder',JSON.stringify(data));
        // }).catch(function(err) {
        //
        // });
    }

    templateObject.getAllTBillData = function() {
        // sideBarService.getAllBillList().then(function(data) {
        //     //localStorage.setItem('VS1TBillList', JSON.stringify(data) || '');
        //     addVS1Data('TBill',JSON.stringify(data));
        // }).catch(function(err) {
        //
        // });
    }

    templateObject.getAllTBillExData = function() {
        sideBarService.getAllBillExList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Bill ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TBillEx', JSON.stringify(data));
            $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllBillListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Bill List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TBillList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Bill List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllTCreditData = function() {
        sideBarService.getAllCreditList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Credit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Credit ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TCredit', JSON.stringify(data));
            $("<span class='process'>Credits Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getTCreditListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Credit List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
            addVS1Data('TCreditList', JSON.stringify(data));
            $("<span class='process'>Credit List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllTpurchaseOrderNonBackOrderData = function() {
        // sideBarService.getAllPurchaseOrderListNonBo().then(function(data) {
        //     //localStorage.setItem('VS1TpurchaseOrderNonBackOrderList', JSON.stringify(data) || '');
        //     addVS1Data('TpurchaseOrderNonBackOrder',JSON.stringify(data));
        // }).catch(function(err) {
        //
        // });
    }

    templateObject.getAllTpurchaseOrderBackOrderData = function() {
        // sideBarService.getAllPurchaseOrderListBO(initialDataLoad,0).then(function(data) {
        //     addVS1Data('TpurchaseOrderBackOrder',JSON.stringify(data));
        // }).catch(function(err) {
        //
        // });

        sideBarService.getAllTPurchasesBackOrderReportData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Purchase BO Report");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TPurchasesBackOrderReport', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Purchase BO Report Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllTSalesListData = function() {


        sideBarService.getSalesListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Sales List "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Sales List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TSalesList', JSON.stringify(data) || '');
            addVS1Data('TSalesList', JSON.stringify(data));
            $("<span class='process'>Sales List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllTSalesOrderListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Sales Order List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TSalesOrderList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Sales Order List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getAllAppointmentData = function() {
        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Appointment "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Appointment ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TAppointment', JSON.stringify(data));
            $("<span class='process'>Appointments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getTAppointmentListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Appointment List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
            addVS1Data('TAppointmentList', JSON.stringify(data));
            $("<span class='process'>Appointment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

    }
    templateObject.getAllAppointmentListData = function() {
      sideBarService.getTAppointmentListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
        countObjectTimes++;
        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
        //$(".progressBarInner").text("Bank Account Report "+Math.round(progressPercentage)+"%");
        $(".progressBarInner").text(Math.round(progressPercentage)+"%");
        $(".progressName").text("Appointment List ");
        if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          }else{
            $('.headerprogressbar').addClass('headerprogressbarShow');
            $('.headerprogressbar').removeClass('headerprogressbarHidden');
          }

        }else if(Math.round(progressPercentage) >= 100){
            $('.checkmarkwrapper').removeClass("hide");
          setTimeout(function() {
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarShow');
              $('.headerprogressbar').addClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').removeClass('headerprogressbarShow');
              $('.headerprogressbar').addClass('headerprogressbarHidden');
            }

          }, 1000);
        }
          //localStorage.setItem('VS1BankAccountReportList', JSON.stringify(data) || '');
          addVS1Data('TAppointmentList', JSON.stringify(data));
          $("<span class='process'>Appointment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
      }).catch(function(err) {

      });
    }
    templateObject.getAllTERPPreferenceData = function() {
        sideBarService.getGlobalSettings().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("ERP Preference "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Preference ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TERPPreference', JSON.stringify(data));
            $("<span class='process'>Preferences Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }


    templateObject.getAllTERPPreferenceExtraData = function() {
        sideBarService.getGlobalSettingsExtra().then(function(data) {
          countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("ERP Preference Extra "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage)+"%");
              $(".progressName").text("Preference Extra ");
              if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }else{
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              }else if(Math.round(progressPercentage) >= 100){
                  $('.checkmarkwrapper').removeClass("hide");
                setTimeout(function() {
                  if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                    $('.headerprogressbar').removeClass('headerprogressbarShow');
                    $('.headerprogressbar').addClass('headerprogressbarHidden');
                  }else{
                    $('.headerprogressbar').removeClass('headerprogressbarShow');
                    $('.headerprogressbar').addClass('headerprogressbarHidden');
                  }

                }, 1000);
              }
        //  }


            addVS1Data('TERPPreferenceExtra', JSON.stringify(data));
            $("<span class='process'>Extra Preferences Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllAppointmentPrefData = function() {
        sideBarService.getAllAppointmentPredList().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Appointment Preferences "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Appointment Preferences ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TAppointmentPreferences', JSON.stringify(data));
            $("<span class='process'>Appointment Preferences Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getTPaymentListData = function() {

        sideBarService.getTPaymentList(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Payment List "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Payment List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TPaymentList', JSON.stringify(data));
            $("<span class='process'>Payment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getTARReportData = function() {

        sideBarService.getTARReport(prevMonth11Date, toDate, false).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("AR Report "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("AR Report ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TARReport', JSON.stringify(data));
            $("<span class='process'>AR Report Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getTAPReportData = function() {

        sideBarService.getTAPReport(prevMonth11Date, toDate, false).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("AP Report "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("AP Report ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TAPReport', JSON.stringify(data));
            $("<span class='process'>AP Report Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getTCustomerPaymentData = function() {
        sideBarService.getTCustomerPaymentList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Customer Payment "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Customer Payment ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TCustomerPayment', JSON.stringify(data));
            $("<span class='process'>Customer Payments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllTCustomerPaymentListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Customer Payment List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TCustomerPaymentList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Customer Payment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }


    templateObject.getTSupplierPaymentData = function() {
        sideBarService.getTSupplierPaymentList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Supplier Payment "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Supplier Payment ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TSupplierPayment', JSON.stringify(data));
            $("<span class='process'>Supplier Payments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });

        sideBarService.getAllTSupplierPaymentListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Supplier Payment List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TSupplierPaymentList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Supplier Payment List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });
    }

    templateObject.getTStatementListData = function() {
        sideBarService.getAllCustomerStatementData(prevMonth11Date, toDate, false).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Statement List "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Statement List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TStatementList', JSON.stringify(data));
            $("<span class='process'>Statement List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getTVS1BankDepositData = function() {
        sideBarService.getAllTVS1BankDepositData(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Bank Deposit ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TVS1BankDeposit', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Bank Deposits Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });

        sideBarService.getAllTBankDepositListData(prevMonth11Date, toDate, false,initialReportLoad,0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Bank Deposit "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Bank Deposit List");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TBankDepositList', JSON.stringify(data)).then(function(datareturn) {
              $("<span class='process'>Bank Deposit List Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
            }).catch(function(err) {

            });

        }).catch(function(err) {

        });

    }

    templateObject.getAllTimeSheetData = function() {
        sideBarService.getAllTimeSheetList(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Timesheets ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TTimeSheet', JSON.stringify(data));
            $("<span class='process'>Timesheets Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllPayRunData = function() {
        sideBarService.getAllPayRunDataVS1(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Pay Run List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TPayRun', JSON.stringify(data));
            $("<span class='process'>Pay Run Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }
    templateObject.getAllPayHistoryData = function() {
        sideBarService.getAllPayHistoryDataVS1(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Pay History List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TPayHistory', JSON.stringify(data));
            $("<span class='process'>Pay History Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllAllowanceData = function() {
        sideBarService.getAllowance(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Allowance List ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TAllowance', JSON.stringify(data));
            $("<span class='process'>Allowances Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllEmployeepaysettingsData = function() {
        sideBarService.getAllEmployeePaySettings(initialDataLoad, 0).then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Timesheets "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Employee Pay Settings ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            addVS1Data('TEmployeepaysettings', JSON.stringify(data));
            $("<span class='process'>Employee Pay Settings Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    templateObject.getAllTExpenseClaimExData = function() {
        sideBarService.getAllExpenseCliamExDataVS1().then(function(data) {
          countObjectTimes++;
          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
          //$(".progressBarInner").text("Job "+Math.round(progressPercentage)+"%");
          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
          $(".progressName").text("Receipt Claim ");
          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }else{
              $('.headerprogressbar').addClass('headerprogressbarShow');
              $('.headerprogressbar').removeClass('headerprogressbarHidden');
            }

          }else if(Math.round(progressPercentage) >= 100){
              $('.checkmarkwrapper').removeClass("hide");
            setTimeout(function() {
              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }else{
                $('.headerprogressbar').removeClass('headerprogressbarShow');
                $('.headerprogressbar').addClass('headerprogressbarHidden');
              }

            }, 1000);
          }
            //localStorage.setItem('VS1TJobVS1List', JSON.stringify(data) || '');
            addVS1Data('TExpenseClaim', JSON.stringify(data));
            $("<span class='process'>Receipt Claim Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
        }).catch(function(err) {

        });
    }

    var job = new CronJob('00 00 00 * * *', function() {

    });
    job.start();

    setTimeout(function() {
        Session.setPersistent('LoggedUserEventFired', false);
    }, 2500);
    /* Start Here */
    if(loggedUserEventFired){
    templateObject.getFollowedAllObjectPull = function() {
        setTimeout(function() {
            if (isPayments) {
                getVS1Data('TStatementList').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTStatementListData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getTStatementListData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getTStatementListData();
                });

            }
            if (isBanking) {
                getVS1Data('TVS1BankDeposit').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTVS1BankDepositData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getTVS1BankDepositData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getTVS1BankDepositData();
                });

            }
            if (isPayroll) {
                getVS1Data('TTimeSheet').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTimeSheetData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllTimeSheetData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTimeSheetData();
                });

                // getVS1Data('TPayRun').then(function(dataObject) {
                //     if (dataObject.length == 0) {
                //         templateObject.getAllPayRunData();
                //     } else {
                //         let getTimeStamp = dataObject[0].timestamp.split(' ');
                //         if (getTimeStamp) {
                //             if (loggedUserEventFired) {
                //                 if (getTimeStamp[0] != currenctTodayDate) {
                //                     templateObject.getAllPayRunData();
                //                 }
                //             }
                //         }
                //     }
                // }).catch(function(err) {
                //     templateObject.getAllPayRunData();
                // });

                getVS1Data('TPayHistory').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllPayHistoryData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllPayHistoryData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllPayHistoryData();
                });

                getVS1Data('TAllowance').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllAllowanceData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllAllowanceData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllAllowanceData();
                });

                getVS1Data('TEmployeepaysettings').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllEmployeepaysettingsData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllEmployeepaysettingsData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllEmployeepaysettingsData();
                });

            }
            if (isAccounts) {
                getVS1Data('TJournalEntryLines').then(function(dataObject) {

                    if (dataObject.length == 0) {
                        templateObject.getAllJournalEntryLineData();
                    } else {

                        let data = JSON.parse(dataObject[0].data);

                        if (data.tjournalentrylines) {
                            templateObject.getAllJournalEntryLineData();
                        } else {

                        }
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllJournalEntryLineData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllJournalEntryLineData();
                });
            }
            if (isBanking) {
                getVS1Data('TReconciliation').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTReconcilationData();
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.treconciliation;
                        if (useData.length > 0) {
                            if (useData[0].Id) {
                                templateObject.getAllTReconcilationData();
                            }
                        }else{
                          templateObject.getAllTReconcilationData();
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTReconcilationData();
                });
            }
            if (isExpenseClaims) {
              getVS1Data('TExpenseClaim').then(function(dataObject) {
                  if (dataObject.length == 0) {
                      templateObject.getAllTExpenseClaimExData();
                  } else {
                      let data = JSON.parse(dataObject[0].data);
                      let useData = data.texpenseclaimex;
                      if (useData.length > 0) {
                          if (useData[0].Id) {
                              templateObject.getAllTExpenseClaimExData();
                          }
                      }else{
                        templateObject.getAllTExpenseClaimExData();
                      }
                  }
              }).catch(function(err) {
                  templateObject.getAllTExpenseClaimExData();
              });
            }
            if (isInventory) {
                getVS1Data('TStockAdjustEntry').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTStockAdjustEntryData();
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tstockadjustentry;
                        if (useData.length > 0) {
                            if (useData[0].Id) {
                                templateObject.getAllTStockAdjustEntryData();
                            } else {
                                let getTimeStamp = dataObject[0].timestamp.split(' ');
                                if (getTimeStamp) {
                                    if (loggedUserEventFired) {
                                        if (getTimeStamp[0] != currenctTodayDate) {
                                            templateObject.getAllTStockAdjustEntryData();
                                        }
                                    }
                                }
                            }
                        }else{
                          templateObject.getAllTStockAdjustEntryData();
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTStockAdjustEntryData();
                });
            }

            if (isReports) {
                getVS1Data('TARReport').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTARReportData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getTARReportData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getTARReportData();
                });

                getVS1Data('TAPReport').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTAPReportData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getTAPReportData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getTAPReportData();
                });
            }
            if (isPayments) {
                getVS1Data('TPaymentList').then(function(dataObject) {

                    if (dataObject.length == 0) {
                        templateObject.getTPaymentListData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getTPaymentListData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getTPaymentListData();
                });

                getVS1Data('TSupplierPayment').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTSupplierPaymentData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getTSupplierPaymentData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getTSupplierPaymentData();
                });

                getVS1Data('TCustomerPayment').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTCustomerPaymentData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getTCustomerPaymentData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getTCustomerPaymentData();
                });

                getVS1Data('TAwaitingSupplierPayment').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllAwaitingSupplierPaymentData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllAwaitingSupplierPaymentData();
                });

                getVS1Data('TAwaitingCustomerPayment').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllAwaitingCustomerPaymentData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllAwaitingCustomerPaymentData();
                });
            }
            if (isBanking) {
                getVS1Data('TBankAccountReport').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllBankAccountReportData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllBankAccountReportData();
                });
            }
            if (isContacts) {
                getVS1Data('TTransactionListReport').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTTransactionListReportData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllTTransactionListReportData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTTransactionListReportData();
                });
            }
            if(progressPercentage == 0){
              $('.loadingbar').css('width', 100 + '%').attr('aria-valuenow', 100);
              $(".headerprogressLabel").text("All Your Information Loaded");
              $(".progressBarInner").text(""+Math.round(100)+"%");
              $('.checkmarkwrapper').removeClass("hide");
              $('.process').addClass('killProgressBar');
              if (launchAllocations) {
                setTimeout(function () {
                  $('.allocationModal').removeClass('killAllocationPOP');
                }, 800);
              }
              setTimeout(function() {
              $('.headerprogressbar').removeClass('headerprogressbarShow');
              $('.headerprogressbar').addClass('headerprogressbarHidden');
              $('.headerprogressbar').addClass('killProgressBar');
              if (launchAllocations) {
                setTimeout(function () {
                  $('.allocationModal').removeClass('killAllocationPOP');
                }, 800);
              }
            }, 3000);
            }
        }, 3000);

        setTimeout(function() {
          $('.loadingbar').css('width', 100 + '%').attr('aria-valuenow', 100);
          $(".progressBarInner").text(""+Math.round(100)+"%");
          $('.checkmarkwrapper').removeClass("hide");
          $('.process').addClass('killProgressBar');
          if (launchAllocations) {
            setTimeout(function () {
            $('.allocationModal').removeClass('killAllocationPOP');
          }, 800);

          }
          setTimeout(function() {
          $('.headerprogressbar').removeClass('headerprogressbarShow');
          $('.headerprogressbar').addClass('headerprogressbarHidden');
          $('.headerprogressbar').addClass('killProgressBar');
          if (launchAllocations) {
            setTimeout(function () {
            $('.allocationModal').removeClass('killAllocationPOP');
          }, 800);
          }
        }, 5000);
      }, 40000);

    }

    //Followed by Bill Details
    templateObject.getFollowedBillDetailsPull = function() {
        setTimeout(function() {
            if (isPurchases) {

              getVS1Data('TCredit').then(function(dataObject) {
                  if (dataObject.length == 0) {
                      templateObject.getAllTCreditData();
                  } else {
                      let data = JSON.parse(dataObject[0].data);
                      let useData = data.tcredit;
                      if (useData.length > 0) {
                          if (useData[0].Id) {
                              templateObject.getAllTCreditData();
                          } else {
                              let getTimeStamp = dataObject[0].timestamp.split(' ');
                              if (getTimeStamp) {
                                  if (loggedUserEventFired) {
                                      if (getTimeStamp[0] != currenctTodayDate) {
                                          templateObject.getAllTCreditData();
                                      }
                                  }
                              }
                          }
                      }else{
                        templateObject.getAllTCreditData();
                      }


                  }
              }).catch(function(err) {
                  templateObject.getAllTCreditData();
              });

                getVS1Data('TbillReport').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTbillReportData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllTbillReportData();
                });
                getVS1Data('TBillEx').then(function(dataObject) {
                    if (dataObject.length == 0) {
                      sideBarService.getAllBillExList(initialDataLoad, 0).then(function(data) {
                        countObjectTimes++;
                        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                        //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
                        $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                        $(".progressName").text("Bill ");
                        if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                            $('.headerprogressbar').removeClass('headerprogressbarHidden');
                          }else{
                            $('.headerprogressbar').addClass('headerprogressbarShow');
                            $('.headerprogressbar').removeClass('headerprogressbarHidden');
                          }

                        }else if(Math.round(progressPercentage) >= 100){
                            $('.checkmarkwrapper').removeClass("hide");
                          setTimeout(function() {
                            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                              $('.headerprogressbar').removeClass('headerprogressbarShow');
                              $('.headerprogressbar').addClass('headerprogressbarHidden');
                            }else{
                              $('.headerprogressbar').removeClass('headerprogressbarShow');
                              $('.headerprogressbar').addClass('headerprogressbarHidden');
                            }

                          }, 1000);
                        }
                          addVS1Data('TBillEx', JSON.stringify(data));
                          $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                          templateObject.getFollowedAllObjectPull();
                      }).catch(function(err) {
                          templateObject.getFollowedAllObjectPull();
                      });
                    } else {
                        let data = JSON.parse(dataObject[0].data);

                        let useData = data.tbillex;
                        if (useData.length > 0) {
                            if (useData[0].Id) {
                              sideBarService.getAllBillExList(initialDataLoad, 0).then(function(data) {
                                countObjectTimes++;
                                progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                                $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                                //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
                                $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                                $(".progressName").text("Bill ");
                                if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                  if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                  }else{
                                    $('.headerprogressbar').addClass('headerprogressbarShow');
                                    $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                  }

                                }else if(Math.round(progressPercentage) >= 100){
                                    $('.checkmarkwrapper').removeClass("hide");
                                  setTimeout(function() {
                                    if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                      $('.headerprogressbar').removeClass('headerprogressbarShow');
                                      $('.headerprogressbar').addClass('headerprogressbarHidden');
                                    }else{
                                      $('.headerprogressbar').removeClass('headerprogressbarShow');
                                      $('.headerprogressbar').addClass('headerprogressbarHidden');
                                    }

                                  }, 1000);
                                }
                                  addVS1Data('TBillEx', JSON.stringify(data));
                                  $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                  templateObject.getFollowedAllObjectPull();
                              }).catch(function(err) {
                                templateObject.getFollowedAllObjectPull();
                              });
                            } else {
                                let getTimeStamp = dataObject[0].timestamp.split(' ');
                                if (getTimeStamp) {
                                    if (loggedUserEventFired) {
                                        if (getTimeStamp[0] != currenctTodayDate) {
                                          sideBarService.getAllBillExList(initialDataLoad, 0).then(function(data) {
                                            countObjectTimes++;
                                            progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                                            $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                                            //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
                                            $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                                            $(".progressName").text("Bill ");
                                            if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                                $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                              }else{
                                                $('.headerprogressbar').addClass('headerprogressbarShow');
                                                $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                              }

                                            }else if(Math.round(progressPercentage) >= 100){
                                                $('.checkmarkwrapper').removeClass("hide");
                                              setTimeout(function() {
                                                if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                                  $('.headerprogressbar').removeClass('headerprogressbarShow');
                                                  $('.headerprogressbar').addClass('headerprogressbarHidden');
                                                }else{
                                                  $('.headerprogressbar').removeClass('headerprogressbarShow');
                                                  $('.headerprogressbar').addClass('headerprogressbarHidden');
                                                }

                                              }, 1000);
                                            }
                                              addVS1Data('TBillEx', JSON.stringify(data));
                                              $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                              templateObject.getFollowedAllObjectPull();
                                          }).catch(function(err) {
                                            templateObject.getFollowedAllObjectPull();
                                          });
                                        }else{
                                          templateObject.getFollowedAllObjectPull();
                                        }
                                    }
                                }
                            }
                        }else{
                          templateObject.getFollowedAllObjectPull();
                        }


                    }
                }).catch(function(err) {
                  sideBarService.getAllBillExList(initialDataLoad, 0).then(function(data) {
                    countObjectTimes++;
                    progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                    $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                    //$(".progressBarInner").text("Bill "+Math.round(progressPercentage)+"%");
                    $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                    $(".progressName").text("Bill ");
                    if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                      if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                      }else{
                        $('.headerprogressbar').addClass('headerprogressbarShow');
                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                      }

                    }else if(Math.round(progressPercentage) >= 100){
                        $('.checkmarkwrapper').removeClass("hide");
                      setTimeout(function() {
                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                          $('.headerprogressbar').removeClass('headerprogressbarShow');
                          $('.headerprogressbar').addClass('headerprogressbarHidden');
                        }else{
                          $('.headerprogressbar').removeClass('headerprogressbarShow');
                          $('.headerprogressbar').addClass('headerprogressbarHidden');
                        }

                      }, 1000);
                    }
                      addVS1Data('TBillEx', JSON.stringify(data));
                      $("<span class='process'>Bills Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                      templateObject.getFollowedAllObjectPull();
                  }).catch(function(err) {
                    templateObject.getFollowedAllObjectPull();
                  });
                });

            }
            setTimeout(function() {
            if (isBanking) {
                getVS1Data('TCheque').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTChequeData();
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tchequeex;
                        if (useData.length > 0) {
                            if (useData[0].Id) {
                                templateObject.getAllTChequeData();
                            }else{
                              let getTimeStamp = dataObject[0].timestamp.split(' ');
                              if (getTimeStamp) {
                                  if (loggedUserEventFired) {
                                      if (getTimeStamp[0] != currenctTodayDate) {
                                          templateObject.getAllTChequeData();
                                      }
                                  }
                              }
                            }
                        }else{
                          templateObject.getAllTChequeData();
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTChequeData();
                });

            }
          }, 2000);
        }, 2000);

    }

    //Followed by Purchase Details
    templateObject.getFollowedPurchaseDetailsPull = function() {
        setTimeout(function() {
            if (isPurchases) {
                getVS1Data('TPurchaseOrderEx').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function(data) {
                          countObjectTimes++;
                          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                          //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
                          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                          $(".progressName").text("Purchase Order ");
                          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }else{
                              $('.headerprogressbar').addClass('headerprogressbarShow');
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }

                          }else if(Math.round(progressPercentage) >= 100){
                              $('.checkmarkwrapper').removeClass("hide");
                            setTimeout(function() {
                              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                              }else{
                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                              }

                            }, 1000);
                          }
                            addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
                            $("<span class='process'>Purchase Orders Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                            //templateObject.getFollowedAllObjectPull();
                            templateObject.getFollowedBillDetailsPull();
                        }).catch(function(err) {
                            //templateObject.getFollowedAllObjectPull();
                            templateObject.getFollowedBillDetailsPull();
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tpurchaseorderex;
                        if (useData[0].Id) {
                            sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function(data) {
                              countObjectTimes++;
                              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                              //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
                              $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                              $(".progressName").text("Purchase Order ");
                              if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                }else{
                                  $('.headerprogressbar').addClass('headerprogressbarShow');
                                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                }

                              }else if(Math.round(progressPercentage) >= 100){
                                  $('.checkmarkwrapper').removeClass("hide");
                                setTimeout(function() {
                                  if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                    $('.headerprogressbar').removeClass('headerprogressbarShow');
                                    $('.headerprogressbar').addClass('headerprogressbarHidden');
                                  }else{
                                    $('.headerprogressbar').removeClass('headerprogressbarShow');
                                    $('.headerprogressbar').addClass('headerprogressbarHidden');
                                  }

                                }, 1000);
                              }
                                addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
                                $("<span class='process'>Purchase Order Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                //templateObject.getFollowedAllObjectPull();
                                templateObject.getFollowedBillDetailsPull();
                            }).catch(function(err) {
                                //templateObject.getFollowedAllObjectPull();
                                templateObject.getFollowedBillDetailsPull();
                            });
                        } else {
                            let getTimeStamp = dataObject[0].timestamp.split(' ');
                            if (getTimeStamp) {
                                if (loggedUserEventFired) {
                                    if (getTimeStamp[0] != currenctTodayDate) {
                                        sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function(data) {
                                          countObjectTimes++;
                                          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                                          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                                          //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
                                          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                                          $(".progressName").text("Purchase Order ");
                                          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                            }else{
                                              $('.headerprogressbar').addClass('headerprogressbarShow');
                                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                            }

                                          }else if(Math.round(progressPercentage) >= 100){
                                              $('.checkmarkwrapper').removeClass("hide");
                                            setTimeout(function() {
                                              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                                              }else{
                                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                                              }

                                            }, 1000);
                                          }
                                            addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
                                            $("<span class='process'>Purchase Order Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                            //templateObject.getFollowedAllObjectPull();
                                            templateObject.getFollowedBillDetailsPull();
                                        }).catch(function(err) {
                                            //templateObject.getFollowedAllObjectPull();
                                            templateObject.getFollowedBillDetailsPull();
                                        });
                                    }else{
                                      templateObject.getFollowedBillDetailsPull();
                                    }
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    sideBarService.getAllPurchaseOrderList(initialDataLoad, 0).then(function(data) {
                      countObjectTimes++;
                      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                      //$(".progressBarInner").text("Purchase Order "+Math.round(progressPercentage)+"%");
                      $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                      $(".progressName").text("Purchase Order ");
                      if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }else{
                          $('.headerprogressbar').addClass('headerprogressbarShow');
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }

                      }else if(Math.round(progressPercentage) >= 100){
                          $('.checkmarkwrapper').removeClass("hide");
                        setTimeout(function() {
                          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }else{
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }

                        }, 1000);
                      }
                        addVS1Data('TPurchaseOrderEx', JSON.stringify(data));
                        $("<span class='process'>Purchase Order Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                        //templateObject.getFollowedAllObjectPull();
                        templateObject.getFollowedBillDetailsPull();
                    }).catch(function(err) {
                        //templateObject.getFollowedAllObjectPull();
                        templateObject.getFollowedBillDetailsPull();

                    });
                });


                getVS1Data('TpurchaseOrderNonBackOrder').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTpurchaseOrderNonBackOrderData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllTpurchaseOrderNonBackOrderData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTpurchaseOrderNonBackOrderData();
                });

                getVS1Data('TpurchaseOrderBackOrder').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTpurchaseOrderBackOrderData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllTpurchaseOrderBackOrderData();
                });
            } else {
                templateObject.getFollowedAllObjectPull();
                if (isBanking) {
                    getVS1Data('TCheque').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            templateObject.getAllTChequeData();
                        } else {
                            let data = JSON.parse(dataObject[0].data);
                            let useData = data.tchequeex;
                            if (useData.length > 0) {
                                if (useData[0].Id) {
                                    templateObject.getAllTChequeData();
                                }else{
                                  let getTimeStamp = dataObject[0].timestamp.split(' ');
                                  if (getTimeStamp) {
                                      if (loggedUserEventFired) {
                                          if (getTimeStamp[0] != currenctTodayDate) {
                                              templateObject.getAllTChequeData();
                                          }
                                      }
                                  }
                                }
                            }else{
                              templateObject.getAllTChequeData();
                            }
                        }
                    }).catch(function(err) {
                        templateObject.getAllTChequeData();
                    });

                }
                //templateObject.getFollowedBillDetailsPull();
            }


        }, 3000);

    }
    /* Quick Objects*/
    templateObject.getFollowedQuickDataDetailsPull = function() {
        setTimeout(function() {
            if (isSettings) {
                getVS1Data('TTaxcodeVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTaxCodeData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllTaxCodeData();
                });
            }
            if (isSettings) {
                getVS1Data('TTermsVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTermsData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllTermsData();
                });
            }
            if (isSettings) {
                getVS1Data('TDeptClass').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllDepartmentData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllDepartmentData();
                });
            }
            if (isCurrencyEnable) {
                if ((!isSettings) && (!isSales)) {

                } else {
                    getVS1Data('TCurrency').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            templateObject.getAllCurrencyData();
                        } else {}
                    }).catch(function(err) {
                        templateObject.getAllCurrencyData();
                    });
                }
            }

            if (isSettings) {
                getVS1Data('TCountries').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTCountriesData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getTCountriesData();
                });
            } else {
                if (isContacts) {
                    getVS1Data('TCountries').then(function(dataObject) {
                        if (dataObject.length == 0) {
                            templateObject.getTCountriesData();
                        } else {}
                    }).catch(function(err) {
                        templateObject.getTCountriesData();
                    });
                }
            }

            if (isSettings) {
                getVS1Data('TPaymentMethod').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTPaymentMethodData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getTPaymentMethodData();
                });
            }

            if ((!isContacts) || (!isInventory)) {

            } else {
                getVS1Data('TClientType').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getTClientTypeData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getTClientTypeData();
                });

            }

            if (isSales) {
                getVS1Data('TLeadStatusType').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllLeadStatusData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllLeadStatusData();
                });
            }
            if (isContacts) {
                getVS1Data('TShippingMethod').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllShippingMethodData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllShippingMethodData();
                });
            }
            if (isAccounts) {
                getVS1Data('TAccountType').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllAccountTypeData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllAccountTypeData();
                });
            }

            if (isSettings) {
                getVS1Data('TERPForm').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllERPFormData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllERPFormData();
                });

                getVS1Data('TEmployeeFormAccessDetail').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllEmployeeFormAccessDetailData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllEmployeeFormAccessDetailData();
                });
            }

              if (isAppointmentScheduling) {
                if (isContacts) {

                } else {
                    templateObject.getAllEmployeeData();
                }

                getVS1Data('TAppointment').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                          countObjectTimes++;
                          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                          //$(".progressBarInner").text("Appointment "+Math.round(progressPercentage)+"%");
                          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                          $(".progressName").text("Appointment ");
                          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }else{
                              $('.headerprogressbar').addClass('headerprogressbarShow');
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }

                          }else if(Math.round(progressPercentage) >= 100){
                              $('.checkmarkwrapper').removeClass("hide");
                            setTimeout(function() {
                              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                              }else{
                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                              }

                            }, 1000);
                          }
                            addVS1Data('TAppointment', JSON.stringify(data));
                            $("<span class='process'>Appointments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");

                            setTimeout(function() {
                            templateObject.getFollowedPurchaseDetailsPull();
                            templateObject.getAllAppointmentListData();
                          }, 1000);
                        }).catch(function(err) {
                            setTimeout(function() {
                            templateObject.getFollowedPurchaseDetailsPull();
                            templateObject.getAllAppointmentListData();
                          }, 1000);
                        });

                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                                      countObjectTimes++;
                                      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                                      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                                      //$(".progressBarInner").text("Appointment "+Math.round(progressPercentage)+"%");
                                      $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                                      $(".progressName").text("Appointment ");
                                      if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                        }else{
                                          $('.headerprogressbar').addClass('headerprogressbarShow');
                                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                        }

                                      }else if(Math.round(progressPercentage) >= 100){
                                          $('.checkmarkwrapper').removeClass("hide");
                                        setTimeout(function() {
                                          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                                          }else{
                                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                                          }

                                        }, 1000);
                                      }
                                        addVS1Data('TAppointment', JSON.stringify(data));
                                        $("<span class='process'>Appointments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                        setTimeout(function() {
                                        templateObject.getFollowedPurchaseDetailsPull();
                                        templateObject.getAllAppointmentListData();
                                      }, 1000);
                                    }).catch(function(err) {
                                        setTimeout(function() {
                                        templateObject.getFollowedPurchaseDetailsPull();
                                        templateObject.getAllAppointmentListData();
                                      }, 1000);
                                    });
                                }else{
                                  setTimeout(function() {
                                  templateObject.getFollowedPurchaseDetailsPull();
                                  templateObject.getAllAppointmentListData();
                                }, 1000);
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    sideBarService.getAllAppointmentList(initialDataLoad, 0).then(function(data) {
                      countObjectTimes++;
                      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                      //$(".progressBarInner").text("Appointment "+Math.round(progressPercentage)+"%");
                      $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                      $(".progressName").text("Appointment ");
                      if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }else{
                          $('.headerprogressbar').addClass('headerprogressbarShow');
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }

                      }else if(Math.round(progressPercentage) >= 100){
                          $('.checkmarkwrapper').removeClass("hide");
                        setTimeout(function() {
                          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }else{
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }

                        }, 1000);
                      }
                        addVS1Data('TAppointment', JSON.stringify(data));
                        $("<span class='process'>Appointments Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                        setTimeout(function() {
                        templateObject.getFollowedPurchaseDetailsPull();
                        templateObject.getAllAppointmentListData();
                      }, 1000);
                    }).catch(function(err) {
                        setTimeout(function() {
                        templateObject.getFollowedPurchaseDetailsPull();
                        templateObject.getAllAppointmentListData();
                      }, 1000);
                    });
                });
                getVS1Data('TAppointmentPreferences').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllAppointmentPrefData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllAppointmentPrefData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                  templateObject.getAllAppointmentPrefData();
                });

                getVS1Data('TERPPreference').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTERPPreferenceData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllTERPPreferenceData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTERPPreferenceData();
                });

                getVS1Data('TERPPreferenceExtra').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTERPPreferenceExtraData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllTERPPreferenceExtraData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTERPPreferenceExtraData();
                });
              }else{
                setTimeout(function() {
                templateObject.getFollowedPurchaseDetailsPull();
              }, 1000);
              }

        }, 3000);
    }
    /* End Quick Objects */


    //Followed By Sales Details
    templateObject.getFollowedSalesDetailsPull = function() {
        setTimeout(function() {
            if (isSales) {
                getVS1Data('TSalesList').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTSalesListData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllTSalesListData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTSalesListData();
                });

                getVS1Data('TInvoiceNonBackOrder').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllInvoiceListNonBOData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllInvoiceListNonBOData();
                });

                getVS1Data('TInvoiceEx').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function(data) {
                          countObjectTimes++;
                          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                          //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
                          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                          $(".progressName").text("Invoice ");
                          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }else{
                              $('.headerprogressbar').addClass('headerprogressbarShow');
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }

                          }else if(Math.round(progressPercentage) >= 100){
                              $('.checkmarkwrapper').removeClass("hide");
                            setTimeout(function() {
                              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                              }else{
                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                              }

                            }, 1000);
                          }
                            addVS1Data('TInvoiceEx', JSON.stringify(data));
                            $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                            templateObject.getFollowedQuickDataDetailsPull();
                        }).catch(function(err) {
                            templateObject.getFollowedQuickDataDetailsPull();
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tinvoiceex;
                        if (useData[0].Id) {
                            sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function(data) {
                              countObjectTimes++;
                              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                              //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
                              $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                              $(".progressName").text("Invoice ");
                              if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                }else{
                                  $('.headerprogressbar').addClass('headerprogressbarShow');
                                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                }

                              }else if(Math.round(progressPercentage) >= 100){
                                  $('.checkmarkwrapper').removeClass("hide");
                                setTimeout(function() {
                                  if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                    $('.headerprogressbar').removeClass('headerprogressbarShow');
                                    $('.headerprogressbar').addClass('headerprogressbarHidden');
                                  }else{
                                    $('.headerprogressbar').removeClass('headerprogressbarShow');
                                    $('.headerprogressbar').addClass('headerprogressbarHidden');
                                  }

                                }, 1000);
                              }
                                addVS1Data('TInvoiceEx', JSON.stringify(data));
                                $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                //setTimeout(function() {
                                templateObject.getFollowedQuickDataDetailsPull();
                                //}, 3000);
                            }).catch(function(err) {
                                //setTimeout(function() {
                                templateObject.getFollowedQuickDataDetailsPull();
                                //}, 3000);
                            });
                        } else {

                            let getTimeStamp = dataObject[0].timestamp.split(' ');
                            if (getTimeStamp) {
                                if (loggedUserEventFired) {
                                    if (getTimeStamp[0] != currenctTodayDate) {
                                        sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function(data) {
                                          countObjectTimes++;
                                          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                                          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                                          //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
                                          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                                          $(".progressName").text("Invoice ");
                                          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                            }else{
                                              $('.headerprogressbar').addClass('headerprogressbarShow');
                                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                            }

                                        }else if(Math.round(progressPercentage) >= 100){
                                            $('.checkmarkwrapper').removeClass("hide");
                                            setTimeout(function() {
                                              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                                              }else{
                                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                                              }

                                            }, 1000);
                                          }
                                            addVS1Data('TInvoiceEx', JSON.stringify(data));
                                            $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                            //setTimeout(function() {
                                            templateObject.getFollowedQuickDataDetailsPull();
                                            //  }, 3000);
                                        }).catch(function(err) {
                                            //setTimeout(function() {
                                            templateObject.getFollowedQuickDataDetailsPull();
                                            //}, 3000);
                                        });
                                    }else{
                                      templateObject.getFollowedQuickDataDetailsPull();
                                    }
                                }
                            }

                        }
                    }
                }).catch(function(err) {
                    sideBarService.getAllInvoiceList(initialDataLoad, 0).then(function(data) {
                      countObjectTimes++;
                      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                      //$(".progressBarInner").text("Invoice "+Math.round(progressPercentage)+"%");
                      $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                      $(".progressName").text("Invoice ");
                      if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }else{
                          $('.headerprogressbar').addClass('headerprogressbarShow');
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }

                      }else if(Math.round(progressPercentage) >= 100){
                          $('.checkmarkwrapper').removeClass("hide");
                        setTimeout(function() {
                          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }else{
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }

                        }, 1000);
                      }
                        addVS1Data('TInvoiceEx', JSON.stringify(data));
                        $("<span class='process'>Invoices Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                        //setTimeout(function() {
                        templateObject.getFollowedQuickDataDetailsPull();
                        //}, 3000);
                    }).catch(function(err) {
                        //setTimeout(function() {
                        templateObject.getFollowedQuickDataDetailsPull();
                        //}, 3000);
                    });
                });
                templateObject.getAllInvoiceListData();
                getVS1Data('TSalesOrderEx').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllSalesOrderExListData();
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tsalesorderex;
                        if (useData[0].Id) {
                            templateObject.getAllSalesOrderExListData();
                        } else {
                            let getTimeStamp = dataObject[0].timestamp.split(' ');
                            if (getTimeStamp) {
                                if (loggedUserEventFired) {
                                    if (getTimeStamp[0] != currenctTodayDate) {
                                        templateObject.getAllSalesOrderExListData();
                                    }
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllSalesOrderExListData();
                });

                getVS1Data('TRefundSale').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllRefundListData();
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.trefundsale;
                        if (useData[0].Id) {
                            templateObject.getAllRefundListData();
                        } else {
                            let getTimeStamp = dataObject[0].timestamp.split(' ');
                            if (getTimeStamp) {
                                if (loggedUserEventFired) {
                                    if (getTimeStamp[0] != currenctTodayDate) {
                                        templateObject.getAllRefundListData();
                                    }
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllRefundListData();
                });


                // getVS1Data('BackOrderSalesList').then(function(dataObject) {
                //     if (dataObject.length == 0) {
                //         templateObject.getAllBOInvoiceListData();
                //     } else {}
                // }).catch(function(err) {
                //     templateObject.getAllBOInvoiceListData();
                // });

                getVS1Data('TQuote').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTQuoteData();
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tquoteex;
                        if (useData.length > 0) {
                            if (useData[0].Id) {
                                templateObject.getAllTQuoteData();
                            } else {
                                let getTimeStamp = dataObject[0].timestamp.split(' ');
                                if (getTimeStamp) {
                                    if (loggedUserEventFired) {
                                        if (getTimeStamp[0] != currenctTodayDate) {
                                            templateObject.getAllTQuoteData();
                                        }
                                    }
                                }
                            }
                        }else{
                            templateObject.getAllTQuoteData();
                        }


                    }
                }).catch(function(err) {
                    templateObject.getAllTQuoteData();
                });
                getVS1Data('TsalesOrderNonBackOrder').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTsalesOrderNonBackOrderData();
                    } else {}
                }).catch(function(err) {
                    templateObject.getAllTsalesOrderNonBackOrderData();
                });

            } else {
                templateObject.getFollowedQuickDataDetailsPull();
            }

            if(isShipping){
              getVS1Data('TInvoiceBackOrder').then(function (dataObject) {
                  if(dataObject.length == 0){
                      templateObject.getAllBackOrderInvoicetData();
                  }else{
                      let data = JSON.parse(dataObject[0].data);
                      let useData = data.tinvoicebackorder;
                      if(useData[0].Id){
                          templateObject.getAllBackOrderInvoicetData();
                      }else{
                          let getTimeStamp = dataObject[0].timestamp.split(' ');
                          if(getTimeStamp){
                              if(loggedUserEventFired){
                                  if(getTimeStamp[0] != currenctTodayDate){
                                    templateObject.getAllBackOrderInvoicetData();
                                  }
                              }
                          }
                      }
                  }
              }).catch(function (err) {
                  templateObject.getAllBackOrderInvoicetData();
              });
            }else{
              allDataToLoad = allDataToLoad - 1;
            }

        }, 3000);
    }


    //Followed By Contact Details
    templateObject.getFollowedContactDetailsPull = function() {
        setTimeout(function() {
            if (isContacts) {
                var currentBeginDate = new Date();
                var begunDate = moment(currentBeginDate).format("DD/MM/YYYY");
                let fromDateMonth = (currentBeginDate.getMonth() + 1)
                let fromDateDay = currentBeginDate.getDate();
                if ((currentBeginDate.getMonth()+1) < 10) {
                    fromDateMonth = "0" + (currentBeginDate.getMonth() + 1);
                } else {
                    fromDateMonth = (currentBeginDate.getMonth() + 1);
                }

                if (currentBeginDate.getDate() < 10) {
                    fromDateDay = "0" + currentBeginDate.getDate();
                }
                var toDate = currentBeginDate.getFullYear() + "-" + (fromDateMonth) + "-" + (fromDateDay);
                let prevMonth11Date = (moment().subtract(reportsloadMonths, 'months')).format("YYYY-MM-DD");
                getVS1Data('TERPCombinedContactsVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        sideBarService.getAllContactCombineVS1(initialDataLoad, 0).then(function(data) {
                          countObjectTimes++;
                          progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                          $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                          //$(".progressBarInner").text("Contacts "+Math.round(progressPercentage)+"%");
                          $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                          $(".progressName").text("Contacts ");
                          if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }else{
                              $('.headerprogressbar').addClass('headerprogressbarShow');
                              $('.headerprogressbar').removeClass('headerprogressbarHidden');
                            }

                          }else if(Math.round(progressPercentage) >= 100){
                              $('.checkmarkwrapper').removeClass("hide");
                            setTimeout(function() {
                              if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                              }else{
                                $('.headerprogressbar').removeClass('headerprogressbarShow');
                                $('.headerprogressbar').addClass('headerprogressbarHidden');
                              }

                            }, 1000);
                          }
                            addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
                            $("<span class='process'>Contacts Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                            templateObject.getFollowedSalesDetailsPull();
                        }).catch(function(err) {
                            templateObject.getFollowedSalesDetailsPull();
                        });
                    } else {
                        templateObject.getFollowedSalesDetailsPull();
                    }
                }).catch(function(err) {
                    sideBarService.getAllContactCombineVS1(initialDataLoad, 0).then(function(data) {
                      countObjectTimes++;
                      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                      //$(".progressBarInner").text("Contacts "+Math.round(progressPercentage)+"%");
                      $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                      $(".progressName").text("Contacts ");
                      if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }else{
                          $('.headerprogressbar').addClass('headerprogressbarShow');
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }

                      }else if(Math.round(progressPercentage) >= 100){
                          $('.checkmarkwrapper').removeClass("hide");
                        setTimeout(function() {
                          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }else{
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }

                        }, 1000);
                      }
                        addVS1Data('TERPCombinedContactsVS1', JSON.stringify(data));
                        $("<span class='process'>Contacts Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                        templateObject.getFollowedSalesDetailsPull();
                    }).catch(function(err) {
                        templateObject.getFollowedSalesDetailsPull();
                    });
                });

                getVS1Data('TCustomerVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllCustomersData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllCustomersData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllCustomersData();
                });

                getVS1Data('TJobVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllTJobVS1Data();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllTJobVS1Data();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllTJobVS1Data();
                });

                getVS1Data('TSupplierVS1').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllSuppliersData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllSuppliersData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {
                    templateObject.getAllSuppliersData();
                });

                getVS1Data('TEmployee').then(function(dataObject) {
                    if (dataObject.length == 0) {
                        templateObject.getAllEmployeeData();
                    } else {
                        let getTimeStamp = dataObject[0].timestamp.split(' ');
                        if (getTimeStamp) {
                            if (loggedUserEventFired) {
                                if (getTimeStamp[0] != currenctTodayDate) {
                                    templateObject.getAllEmployeeData();
                                }
                            }
                        }
                    }
                }).catch(function(err) {

                    templateObject.getAllEmployeeData();

                });
            } else {
                templateObject.getFollowedSalesDetailsPull();
            }

        }, 2500);
    }

    //If launching Appoing. Don't worry about the rest
    if (isAppointmentLaunch) {
        if (isAppointmentScheduling) {

            getVS1Data('TAppointment').then(function(dataObject) {
                if (dataObject.length == 0) {
                    templateObject.getAllAppointmentData();
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                templateObject.getAllAppointmentData();
                            }
                        }
                    }
                }
            }).catch(function(err) {
              templateObject.getAllAppointmentData();
            });

            getVS1Data('TAppointmentPreferences').then(function(dataObject) {
                if (dataObject.length == 0) {
                    templateObject.getAllAppointmentPrefData();
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                templateObject.getAllAppointmentPrefData();
                            }
                        }
                    }
                }
            }).catch(function(err) {
              templateObject.getAllAppointmentPrefData();
            });

            getVS1Data('TERPPreference').then(function(dataObject) {
                if (dataObject.length == 0) {
                    templateObject.getAllTERPPreferenceData();
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                templateObject.getAllTERPPreferenceData();
                            }
                        }
                    }
                }
            }).catch(function(err) {
                templateObject.getAllTERPPreferenceData();
            });

            getVS1Data('TERPPreferenceExtra').then(function(dataObject) {
                if (dataObject.length == 0) {
                    templateObject.getAllTERPPreferenceExtraData();
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                templateObject.getAllTERPPreferenceExtraData();
                            }
                        }
                    }
                }
            }).catch(function(err) {
                templateObject.getAllTERPPreferenceExtraData();
            });
        }
        setTimeout(function() {
          if (isInventory) {
            if (isPayroll || isAppointmentScheduling) {
            getVS1Data('TProductWeb').then(function(dataObject) {
                if (dataObject.length == 0) {
                    templateObject.getAllProductServiceData();
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                templateObject.getAllProductServiceData();
                            }
                        }
                    }

                }
            }).catch(function(err) {
                templateObject.getAllProductServiceData();
            });
            }
              getVS1Data('TProductVS1').then(function(dataObject) {
                  if (dataObject.length == 0) {
                      sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) {
                        countObjectTimes++;
                        progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                        $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                        //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                        $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                        $(".progressName").text("Product ");
                        if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                            $('.headerprogressbar').removeClass('headerprogressbarHidden');
                          }else{
                            $('.headerprogressbar').addClass('headerprogressbarShow');
                            $('.headerprogressbar').removeClass('headerprogressbarHidden');
                          }

                        }else if(Math.round(progressPercentage) >= 100){
                            $('.checkmarkwrapper').removeClass("hide");
                          setTimeout(function() {
                            if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                              $('.headerprogressbar').removeClass('headerprogressbarShow');
                              $('.headerprogressbar').addClass('headerprogressbarHidden');
                            }else{
                              $('.headerprogressbar').removeClass('headerprogressbarShow');
                              $('.headerprogressbar').addClass('headerprogressbarHidden');
                            }

                          }, 1000);
                        }
                          addVS1Data('TProductVS1', JSON.stringify(data));
                          $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                          templateObject.getFollowedContactDetailsPull();
                      }).catch(function(err) {
                          templateObject.getFollowedContactDetailsPull();
                      });
                  } else {
                      let getTimeStamp = dataObject[0].timestamp.split(' ');
                      if (getTimeStamp) {
                          if (loggedUserEventFired) {
                              if (getTimeStamp[0] != currenctTodayDate) {
                                  sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) {
                                    countObjectTimes++;
                                    progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                                    $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                                    //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                                    $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                                    $(".progressName").text("Product ");
                                    if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                      if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                      }else{
                                        $('.headerprogressbar').addClass('headerprogressbarShow');
                                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                      }

                                    }else if(Math.round(progressPercentage) >= 100){
                                        $('.checkmarkwrapper').removeClass("hide");
                                      setTimeout(function() {
                                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                          $('.headerprogressbar').removeClass('headerprogressbarShow');
                                          $('.headerprogressbar').addClass('headerprogressbarHidden');
                                        }else{
                                          $('.headerprogressbar').removeClass('headerprogressbarShow');
                                          $('.headerprogressbar').addClass('headerprogressbarHidden');
                                        }

                                      }, 1000);
                                    }
                                      addVS1Data('TProductVS1', JSON.stringify(data));
                                      $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                      templateObject.getFollowedContactDetailsPull();
                                  }).catch(function(err) {
                                      templateObject.getFollowedContactDetailsPull();
                                  });
                              }else{
                                templateObject.getFollowedContactDetailsPull();
                              }
                          }
                      }
                  }
              }).catch(function(err) {
                  sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) {
                    countObjectTimes++;
                    progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                    $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                    //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                    $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                    $(".progressName").text("Product ");
                    if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                      if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                      }else{
                        $('.headerprogressbar').addClass('headerprogressbarShow');
                        $('.headerprogressbar').removeClass('headerprogressbarHidden');
                      }

                    }else if(Math.round(progressPercentage) >= 100){
                        $('.checkmarkwrapper').removeClass("hide");
                      setTimeout(function() {
                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                          $('.headerprogressbar').removeClass('headerprogressbarShow');
                          $('.headerprogressbar').addClass('headerprogressbarHidden');
                        }else{
                          $('.headerprogressbar').removeClass('headerprogressbarShow');
                          $('.headerprogressbar').addClass('headerprogressbarHidden');
                        }

                      }, 1000);
                    }
                      addVS1Data('TProductVS1', JSON.stringify(data));
                      $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                      templateObject.getFollowedContactDetailsPull();
                  }).catch(function(err) {
                      templateObject.getFollowedContactDetailsPull();
                  });
              });

              getVS1Data('TProductStocknSalePeriodReport').then(function(dataObject) {
                  if (dataObject.length == 0) {
                      templateObject.getAllTProductStocknSalePeriodReportData();
                  } else {
                      let getTimeStamp = dataObject[0].timestamp.split(' ');
                      if (getTimeStamp) {
                          if (loggedUserEventFired) {
                              if (getTimeStamp[0] != currenctTodayDate) {
                                  templateObject.getAllTProductStocknSalePeriodReportData();
                              }
                          }
                      }

                  }
              }).catch(function(err) {
                  templateObject.getAllTProductStocknSalePeriodReportData();
              });

              getVS1Data('TStockTransferEntry').then(function(dataObject) {
                  if (dataObject.length == 0) {
                      templateObject.getAllTStockTransferEntryData();
                  } else {
                      let getTimeStamp = dataObject[0].timestamp.split(' ');
                      if (getTimeStamp) {
                          if (loggedUserEventFired) {
                              if (getTimeStamp[0] != currenctTodayDate) {
                                  templateObject.getAllTStockTransferEntryData();
                              }
                          }
                      }

                  }
              }).catch(function(err) {
                  templateObject.getAllTProductStocknSalePeriodReportData();
              });
          } else {
            sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) {
              countObjectTimes++;
              progressPercentage = (countObjectTimes * 100) / allDataToLoad;
              $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
              //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
              $(".progressBarInner").text(Math.round(progressPercentage)+"%");
              $(".progressName").text("Product ");
              if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }else{
                  $('.headerprogressbar').addClass('headerprogressbarShow');
                  $('.headerprogressbar').removeClass('headerprogressbarHidden');
                }

              }else if(Math.round(progressPercentage) >= 100){
                  $('.checkmarkwrapper').removeClass("hide");
                setTimeout(function() {
                  if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                    $('.headerprogressbar').removeClass('headerprogressbarShow');
                    $('.headerprogressbar').addClass('headerprogressbarHidden');
                  }else{
                    $('.headerprogressbar').removeClass('headerprogressbarShow');
                    $('.headerprogressbar').addClass('headerprogressbarHidden');
                  }

                }, 1000);
              }
                addVS1Data('TProductVS1', JSON.stringify(data));
                $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                templateObject.getFollowedContactDetailsPull();
            }).catch(function(err) {
              templateObject.getFollowedContactDetailsPull();
            });

          }


        }, 1000);
    } else {
        if (isAccounts) {
            getVS1Data('TAccountVS1').then(function(dataObject) {
                if (dataObject.length == 0) {
                    templateObject.getAllAccountsData();
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                templateObject.getAllAccountsData();
                            }
                        }
                    }
                }
            }).catch(function(err) {
                templateObject.getAllAccountsData();
            });
        }
        if (isInventory) {
          if (isPayroll || isAppointmentScheduling) {
          getVS1Data('TProductWeb').then(function(dataObject) {
              if (dataObject.length == 0) {
                  templateObject.getAllProductServiceData();
              } else {
                  let getTimeStamp = dataObject[0].timestamp.split(' ');
                  if (getTimeStamp) {
                      if (loggedUserEventFired) {
                          if (getTimeStamp[0] != currenctTodayDate) {
                              templateObject.getAllProductServiceData();
                          }
                      }
                  }

              }
          }).catch(function(err) {
              templateObject.getAllProductServiceData();
          });
         }
            getVS1Data('TProductVS1').then(function(dataObject) {
                if (dataObject.length == 0) {
                    sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) {
                      countObjectTimes++;
                      progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                      $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                      //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                      $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                      $(".progressName").text("Product ");
                      if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                        if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }else{
                          $('.headerprogressbar').addClass('headerprogressbarShow');
                          $('.headerprogressbar').removeClass('headerprogressbarHidden');
                        }

                      }else if(Math.round(progressPercentage) >= 100){
                          $('.checkmarkwrapper').removeClass("hide");
                        setTimeout(function() {
                          if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }else{
                            $('.headerprogressbar').removeClass('headerprogressbarShow');
                            $('.headerprogressbar').addClass('headerprogressbarHidden');
                          }

                        }, 1000);
                      }
                        addVS1Data('TProductVS1', JSON.stringify(data));
                        $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                        templateObject.getFollowedContactDetailsPull();
                    }).catch(function(err) {
                        templateObject.getFollowedContactDetailsPull();
                    });
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) {
                                  countObjectTimes++;
                                  progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                                  $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                                  //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                                  $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                                  $(".progressName").text("Product ");
                                  if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                                    if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                      $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                    }else{
                                      $('.headerprogressbar').addClass('headerprogressbarShow');
                                      $('.headerprogressbar').removeClass('headerprogressbarHidden');
                                    }

                                  }else if(Math.round(progressPercentage) >= 100){
                                      $('.checkmarkwrapper').removeClass("hide");
                                    setTimeout(function() {
                                      if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                                        $('.headerprogressbar').removeClass('headerprogressbarShow');
                                        $('.headerprogressbar').addClass('headerprogressbarHidden');
                                      }else{
                                        $('.headerprogressbar').removeClass('headerprogressbarShow');
                                        $('.headerprogressbar').addClass('headerprogressbarHidden');
                                      }

                                    }, 1000);
                                  }
                                    addVS1Data('TProductVS1', JSON.stringify(data));
                                    $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                                    templateObject.getFollowedContactDetailsPull();
                                }).catch(function(err) {
                                    templateObject.getFollowedContactDetailsPull();
                                });
                            }else{
                              templateObject.getFollowedContactDetailsPull();
                            }
                        }
                    }
                }
            }).catch(function(err) {
                sideBarService.getNewProductListVS1(initialBaseDataLoad, 0).then(function(data) {
                  countObjectTimes++;
                  progressPercentage = (countObjectTimes * 100) / allDataToLoad;
                  $('.loadingbar').css('width', progressPercentage + '%').attr('aria-valuenow', progressPercentage);
                  //$(".progressBarInner").text("Product "+Math.round(progressPercentage)+"%");
                  $(".progressBarInner").text(Math.round(progressPercentage)+"%");
                  $(".progressName").text("Product ");
                  if((progressPercentage > 0) && (Math.round(progressPercentage) != 100)){
                    if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                      $('.headerprogressbar').removeClass('headerprogressbarHidden');
                    }else{
                      $('.headerprogressbar').addClass('headerprogressbarShow');
                      $('.headerprogressbar').removeClass('headerprogressbarHidden');
                    }

                  }else if(Math.round(progressPercentage) >= 100){
                      $('.checkmarkwrapper').removeClass("hide");
                    setTimeout(function() {
                      if($('.headerprogressbar').hasClass("headerprogressbarShow")){
                        $('.headerprogressbar').removeClass('headerprogressbarShow');
                        $('.headerprogressbar').addClass('headerprogressbarHidden');
                      }else{
                        $('.headerprogressbar').removeClass('headerprogressbarShow');
                        $('.headerprogressbar').addClass('headerprogressbarHidden');
                      }

                    }, 1000);
                  }
                    addVS1Data('TProductVS1', JSON.stringify(data));
                    $("<span class='process'>Products Loaded <i class='fas fa-check process-check'></i><br></span>").insertAfter(".processContainerAnchor");
                    templateObject.getFollowedContactDetailsPull();
                }).catch(function(err) {
                    templateObject.getFollowedContactDetailsPull();
                });
            });

            getVS1Data('TProductStocknSalePeriodReport').then(function(dataObject) {
                if (dataObject.length == 0) {
                    templateObject.getAllTProductStocknSalePeriodReportData();
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                templateObject.getAllTProductStocknSalePeriodReportData();
                            }
                        }
                    }

                }
            }).catch(function(err) {
                templateObject.getAllTProductStocknSalePeriodReportData();
            });

            getVS1Data('TStockTransferEntry').then(function(dataObject) {
                if (dataObject.length == 0) {
                    templateObject.getAllTStockTransferEntryData();
                } else {
                    let getTimeStamp = dataObject[0].timestamp.split(' ');
                    if (getTimeStamp) {
                        if (loggedUserEventFired) {
                            if (getTimeStamp[0] != currenctTodayDate) {
                                templateObject.getAllTStockTransferEntryData();
                            }
                        }
                    }

                }
            }).catch(function(err) {
                templateObject.getAllTProductStocknSalePeriodReportData();
            });
        } else {
            templateObject.getFollowedContactDetailsPull();
        }
    }
   }



    let isBalanceSheet = Session.get('cloudBalanceSheet');
    let isProfitLoss = Session.get('cloudProfitLoss');
    let isAgedReceivables = Session.get('cloudAgedReceivables');
    let isAgedReceivablesSummary = Session.get('cloudAgedReceivablesSummary');
    let isProductSalesReport = Session.get('cloudProductSalesReport');
    let isSalesReport = Session.get('cloudSalesReport');
    let isSalesSummaryReport = Session.get('cloudSalesSummaryReport');
    let isGeneralLedger = Session.get('cloudGeneralLedger');
    let isTaxSummaryReport = Session.get('cloudTaxSummaryReport');
    let isTrialBalance = Session.get('cloudTrialBalance');
    let is1099Transaction = Session.get('cloud1099Transaction');
    let isAgedPayables = Session.get('cloudAgedPayables');
    let isAgedPayablesSummary = Session.get('cloudAgedPayablesSummary');
    let isPurchaseReport = Session.get('cloudPurchaseReport');
    let isPurchaseSummaryReport = Session.get('cloudPurchaseSummaryReport');
    let isPrintStatement = Session.get('cloudPrintStatement');

    if (isProfitLoss == true) {
        templateObject.isProfitLoss.set(true);
    }
    if (isBalanceSheet == true) {
        templateObject.isBalanceSheet.set(true);
    }
    if (isAgedReceivables == true) {
        templateObject.isAgedReceivables.set(true);
    }
    if (isAgedReceivablesSummary == true) {
        templateObject.isAgedReceivablesSummary.set(true);
    }
    if (isProductSalesReport == true) {
        templateObject.isProductSalesReport.set(true);
    }
    if (isSalesReport == true) {
        templateObject.isSalesReport.set(true);
    }
    if (isSalesSummaryReport == true) {
        templateObject.isSalesSummaryReport.set(true);
    }
    if (isGeneralLedger == true) {
        templateObject.isGeneralLedger.set(true);
    }
    if (isTaxSummaryReport == true) {
        templateObject.isTaxSummaryReport.set(true);
    }
    if (isTrialBalance == true) {
        templateObject.isTrialBalance.set(true);
    }
    if (is1099Transaction == true) {
        templateObject.is1099Transaction.set(true);
    }
    if (isAgedPayables == true) {
        templateObject.isAgedPayables.set(true);
    }
    if (isAgedPayablesSummary == true) {
        templateObject.isAgedPayablesSummary.set(true);
    }
    if (isPurchaseReport == true) {
        templateObject.isPurchaseReport.set(true);
    }
    if (isPurchaseSummaryReport == true) {
        templateObject.isPurchaseSummaryReport.set(true);
    }
    if (isPrintStatement == true) {
        templateObject.isPrintStatement.set(true);
    }

});
Template.newsidenav.events({
    'click #sidenavaccessLevel': function(event) {
        window.open('#', '_self');
    },

    // 'mouseenter .accountsLi': function(event) {
    //     $('#accountsSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .accountsLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .appointmentsLi': function(event) {
    //     $('#appointmentsSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .appointmentsLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .bankingLi': function(event) {
    //     $('#bankingSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .bankingLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .contactsLi': function(event) {
    //     $('#contactsSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .contactsLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .inventoryLi': function(event) {
    //     $('#inventorySubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .inventoryLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .paymentsLi': function(event) {
    //     $('#paymentsSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .paymentsLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .payrollLi': function(event) {
    //     $('#payrollSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .payrollLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .purchasesLi': function(event) {
    //     $('#purchasesSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .purchasesLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .reportsLi': function(event) {
    //     $('#reportsSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .reportsLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .salesLi': function(event) {
    //     $('#salesSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .salesLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .seedtosaleLi': function(event) {
    //     $('#seedToSaleSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .seedtosaleLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    // 'mouseenter .settingsLi': function(event) {
    //     $('#settingsSubmenu').collapse('show');
    //     $('#appointmentsSubmenu').collapse('hide');
    //     $('#bankingSubmenu').collapse('hide');
    //     $('#contactsSubmenu').collapse('hide');
    //     $('#inventorySubmenu').collapse('hide');
    //     $('#paymentsSubmenu').collapse('hide');
    //     $('#payrollSubmenu').collapse('hide');
    //     $('#purchasesSubmenu').collapse('hide');
    //     $('#reportsSubmenu').collapse('hide');
    //     $('#salesSubmenu').collapse('hide');
    //     $('#seedToSaleSubmenu').collapse('hide');
    //     $('#settingsSubmenu').collapse('hide');
    // },
    // 'mouseleave .settingsLi': function(event) {
    //     $('.collapse').collapse('hide');
    // },
    'click .sidenavaccounts': function(event) {
        event.preventDefault();
        FlowRouter.go('/accountsoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();

    },
    'click #sidenavnewaccounts': function(event) {

        if (FlowRouter.current().path == "/accountsoverview") {
            $('#addNewAccount').modal('show');
        } else {
            window.open('/accountsoverview#newaccount', '_self');
        }
    },
    'click #sidenavallocation': function(event) {

        if (FlowRouter.current().path == "/appointments") {
            $('#allocationModal').modal('show');
        } else {
            FlowRouter.go('/appointments#allocationModal');

        }
    },
    'click #sidenavpayroll': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').removeClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        // $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavpayroll': function(event) {

        event.preventDefault();
        FlowRouter.go('/payrolloverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavPayEmployees': function(event) {

        event.preventDefault();
        FlowRouter.go('/payrun');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavjournalentry': function(event) {

        event.preventDefault();
        FlowRouter.go('/journalentrylist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewjournalentry': function(event) {

        event.preventDefault();
        FlowRouter.go('/journalentrycard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavbanking': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').removeClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        // $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavbanking': function(event) {

        event.preventDefault();
        FlowRouter.go('/bankingoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavcheque': function(event) {

        event.preventDefault();
        FlowRouter.go('/chequelist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavreconciliation': function(event) {

        event.preventDefault();
        FlowRouter.go('/reconciliationlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavbankreconciliation': function(event) {
        window.open('/bankrecon', '_self');
    },
    'click #sidenavnewreconcile': function(event) {

        event.preventDefault();
        FlowRouter.go('/reconciliation');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewcheque': function(event) {

        event.preventDefault();
        FlowRouter.go('/chequecard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavbalancesheet': function(event) {

        event.preventDefault();
        FlowRouter.go('/balancesheetreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidebarToggle': function(event) {
        var sideBarPanel = $("#sidenavbar").attr("class");

        if (sideBarPanel.indexOf("toggled") >= 0) {

            Session.setPersistent('sidePanelToggle', "toggled");
            $("#sidenavbar").addClass("toggled");

        } else {

            Session.setPersistent('sidePanelToggle', "");
            ("#sidenavbar").removeClass("toggled");

        }



    },
    'click #sidenavcontacts': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').removeClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        // $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavcontacts': function(event) {

        event.preventDefault();
        FlowRouter.go('/contactoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavdashbaord': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').removeClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
        event.preventDefault();
        FlowRouter.go('/dashboard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavappointment': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').removeClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        // $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavappointment': function(event) {
        event.preventDefault();
        FlowRouter.go('/appointments');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavappointmentList': function(event) {

        event.preventDefault();
        FlowRouter.go('/appointmentlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavappointmenttimeList': function(event) {

        event.preventDefault();
        FlowRouter.go('/appointmenttimelist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavemployeesGreenTrack': function(event) {

        event.preventDefault();
        FlowRouter.go('/employeelist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavfixedassets': function(event) {
        window.open('#', '_self');
    },
    'click #sidenavinventory': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').removeClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        // $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavinventory': function(event) {

        event.preventDefault();
        FlowRouter.go('/inventorylist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewinventory': function(event) {

        event.preventDefault();
        FlowRouter.go('/productview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavmain': function(event) {
        window.open('#', '_self');
    },
    'click #sidenavmanufacturing': function(event) {
        window.open('#', '_self');
    },
    'click #sidenavpayments': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').removeClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavpayments': function(event) {

        event.preventDefault();
        FlowRouter.go('/paymentoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavpurchases': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').removeClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        // $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavpurchases': function(event) {

        event.preventDefault();
        FlowRouter.go('/purchasesoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavreports': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').removeClass('opacityNotActive');
        $('.reportsLi2').removeClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        // $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
        event.preventDefault();
        FlowRouter.go('/allreports');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenav1099report': function(event) {

        event.preventDefault();
        FlowRouter.go('/1099report');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavagedpayables': function(event) {

        event.preventDefault();
        FlowRouter.go('/agedpayables');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavagedpayablessummary': function(event) {

        event.preventDefault();
        FlowRouter.go('/agedpayablessummary');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavagedreceivables': function(event) {

        event.preventDefault();
        FlowRouter.go('/agedreceivables');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavagedreceivablessummary': function(event) {

        event.preventDefault();
        FlowRouter.go('/agedreceivablessummary');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavbalancesheetreport': function(event) {

        event.preventDefault();
        FlowRouter.go('/balancesheetreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavgeneralledger': function(event) {

        event.preventDefault();
        FlowRouter.go('/generalledger');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavstatementlist': function(event) {

        event.preventDefault();
        FlowRouter.go('/statementlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavstatementlist2': function(event) {

        event.preventDefault();
        FlowRouter.go('/statementlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavprofitlossreport': function(event) {

        event.preventDefault();
        FlowRouter.go('/profitlossreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavpurchasesreport': function(event) {
        event.preventDefault();
        FlowRouter.go('/purchasesreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();

    },
    'click #sidenavpurchasesummaryreport': function(event) {

        event.preventDefault();
        FlowRouter.go('/purchasesummaryreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavproductsalesreport': function(event) {

        event.preventDefault();
        FlowRouter.go('/productsalesreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavsalesreport': function(event) {

        event.preventDefault();
        FlowRouter.go('/salesreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavsalessummaryreport': function(event) {

        event.preventDefault();
        FlowRouter.go('/salessummaryreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavtaxsummaryreport': function(event) {

        event.preventDefault();
        FlowRouter.go('/taxsummaryreport');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavtrialbalance': function(event) {

        event.preventDefault();
        FlowRouter.go('/trialbalance');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .sidenavreports': function(event) {

        event.preventDefault();
        FlowRouter.go('/allreports');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavsales': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').removeClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        // $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavsales': function(event) {

        event.preventDefault();
        FlowRouter.go('/salesoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .sidenavsettings': function(event) {

        event.preventDefault();
        FlowRouter.go('/settings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavshipping': function(event) {
        event.preventDefault();
        FlowRouter.go('/vs1shipping');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavstockadjust': function(event) {
        event.preventDefault();
        FlowRouter.go('/stockadjustmentoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavstocktransfer': function(event) {
        event.preventDefault();
        FlowRouter.go('/stocktransferlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenaveproductlist': function(event) {

        event.preventDefault();
        FlowRouter.go('/productlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewstockadjust': function(event) {
        //window.open('/stockadjustmentcard', '_self');
        event.preventDefault();
        FlowRouter.go('/stockadjustmentcard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewstocktransfer': function(event) {
        //window.open('/stocktransfercard', '_self');
        event.preventDefault();
        FlowRouter.go('/stocktransfercard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavcustomers': function(event) {

        event.preventDefault();
        FlowRouter.go('/customerlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavemployees': function(event) {

        event.preventDefault();
        FlowRouter.go('/employeelist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavjobs': function(event) {

        event.preventDefault();
        FlowRouter.go('/joblist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavsuppliers': function(event) {

        event.preventDefault();
        FlowRouter.go('/supplierlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewcustomers': function(event) {

        if (FlowRouter.current().path == "/customerscard") {
            window.open('/customerscard', '_self');
        } else {
            event.preventDefault();
            FlowRouter.go('/customerscard');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
        }
    },
    'click #sidenavnewemployees': function(event) {

        if (FlowRouter.current().path == "/employeescard") {
            window.open('/employeescard', '_self');
        } else {
            event.preventDefault();
            FlowRouter.go('/employeescard');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
        }

    },
    'click #sidenavnewsuppliers': function(event) {


        if (FlowRouter.current().path == "/supplierscard") {
            window.open('/supplierscard', '_self');
        } else {
            event.preventDefault();
            FlowRouter.go('/supplierscard');
            let templateObject = Template.instance();
            templateObject.getSetSideNavFocus();
        }
    },
    'click #sidenavawaitingCP': function(event) {

        event.preventDefault();
        FlowRouter.go('/customerawaitingpayments');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavawaitingSPPO': function(event) {

        event.preventDefault();
        FlowRouter.go('/supplierawaitingpurchaseorder');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavawaitingSPBill': function(event) {

        event.preventDefault();
        FlowRouter.go('/supplierawaitingbills');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavcustomerP': function(event) {

        event.preventDefault();
        FlowRouter.go('/customerpayment');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewcustomerP': function(event) {

        event.preventDefault();
        FlowRouter.go('/paymentcard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavsupplierP': function(event) {

        event.preventDefault();
        FlowRouter.go('/supplierpayment');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewsupplierP': function(event) {

        event.preventDefault();
        FlowRouter.go('/supplierpaymentcard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavBill': function(event) {

        event.preventDefault();
        FlowRouter.go('/billlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavCredit': function(event) {

        event.preventDefault();
        FlowRouter.go('/creditlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavPurchaseOrder': function(event) {

        event.preventDefault();
        FlowRouter.go('/purchaseorderlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavPurchaseOrderBO': function(event) {

        event.preventDefault();
        FlowRouter.go('/purchaseorderlistBO');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewBill': function(event) {

        event.preventDefault();
        FlowRouter.go('/billcard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewCredit': function(event) {

        event.preventDefault();
        FlowRouter.go('/creditcard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewPO': function(event) {

        event.preventDefault();
        FlowRouter.go('/purchaseordercard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavInvoice': function(event) {

        event.preventDefault();
        FlowRouter.go('/invoicelist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavRefund': function(event) {
        event.preventDefault();
        FlowRouter.go('/refundlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavInvoiceEmail': function(event) {

        event.preventDefault();
        FlowRouter.go('/invoiceemail');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavInvoiceBO': function(event) {

        event.preventDefault();
        FlowRouter.go('/invoicelistBO');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavQuote': function(event) {

        event.preventDefault();
        FlowRouter.go('/quoteslist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavSalesOrder': function(event) {

        event.preventDefault();
        FlowRouter.go('/salesorderslist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewInvoice': function(event) {

        event.preventDefault();
        FlowRouter.go('/invoicecard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewQuote': function(event) {

        event.preventDefault();
        FlowRouter.go('/quotecard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewRefund': function(event) {

        event.preventDefault();
        FlowRouter.go('/refundcard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewSO': function(event) {

        event.preventDefault();
        FlowRouter.go('/salesordercard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavaccesslevel': function(event) {
        window.open('/accesslevel', '_self');
    },
    'click #sidenavcompanyappsettings': function(event) {
        window.open('/companyappsettings', '_self');
    },
    'click #sidenavcurrenciesSettings': function(event) {

        event.preventDefault();
        FlowRouter.go('/currenciesSettings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavdepartmentSettings': function(event) {

        event.preventDefault();
        FlowRouter.go('/departmentSettings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavorganisationsettings': function(event) {

        event.preventDefault();
        FlowRouter.go('/organisationsettings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavpaymentmethodSettings': function(event) {

        event.preventDefault();
        FlowRouter.go('/paymentmethodSettings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavtaxratesettings': function(event) {

        event.preventDefault();
        FlowRouter.go('/taxratesettings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavtermsettings': function(event) {

        event.preventDefault();
        FlowRouter.go('/termsettings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavtimesheet': function(event) {

        event.preventDefault();
        FlowRouter.go('/timesheet');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavtimeclock': function(event) {
        if (FlowRouter.current().path == "/payrolloverview") {
            $("#btnClockOnOff").trigger("click");
        } else {
            window.open('/payrolloverview#clockOnOff', '_self');
        }
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavseedtosale': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').removeClass('opacityNotActive');
        $('.settingsLi').addClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        // $('#seedToSaleSubmenu').collapse('hide');
        $('#settingsSubmenu').collapse('hide');
    },
    'click .sidenavseedtosale': function(event) {
        FlowRouter.go('/stsdashboard');
    },
    'click #sidenavPlants': function(event) {
        window.open('/stsplants', '_self');
    },
    'click #sidenavHarvest': function(event) {
        window.open('/stsharvests', '_self');
    },
    'click #sidenavPackages': function(event) {
        window.open('/stspackages', '_self');
    },
    'click #sidenavTransfers': function(event) {
        window.open('/ststransfers', '_self');
    },
    'click #sidenavOverviews': function(event) {
        window.open('/stsoverviews', '_self');
    },
    'click #sidenavSettings': function(event) {
        $('.accountsLi').addClass('opacityNotActive');
        $('.appointmentsLi').addClass('opacityNotActive');
        $('.bankingLi').addClass('opacityNotActive');
        $('.contactsLi').addClass('opacityNotActive');
        $('.dashboardLi').addClass('opacityNotActive');
        $('.gsemployeesLi').addClass('opacityNotActive');
        $('.inventoryLi').addClass('opacityNotActive');
        $('.paymentsLi').addClass('opacityNotActive');
        $('.payrollLi').addClass('opacityNotActive');
        $('.purchasesLi').addClass('opacityNotActive');
        $('.reportsLi').addClass('opacityNotActive');
        $('.reportsLi2').addClass('opacityNotActive');
        $('.salesLi').addClass('opacityNotActive');
        $('.seedtosaleLi').addClass('opacityNotActive');
        $('.settingsLi').removeClass('opacityNotActive');
        $('.logoutLi').addClass('opacityNotActive');
        $('#accountsSubmenu').collapse('hide');
        $('#appointmentsSubmenu').collapse('hide');
        $('#bankingSubmenu').collapse('hide');
        $('#contactsSubmenu').collapse('hide');
        $('#inventorySubmenu').collapse('hide');
        $('#paymentsSubmenu').collapse('hide');
        $('#payrollSubmenu').collapse('hide');
        $('#purchasesSubmenu').collapse('hide');
        $('#reportsSubmenu').collapse('hide');
        $('#salesSubmenu').collapse('hide');
        $('#seedToSaleSubmenu').collapse('hide');
        // $('#settingsSubmenu').collapse('hide');
        window.open('/stssettings', '_self');
    },
    'click #sidenavdepositlist': function(event) {
        event.preventDefault();
        FlowRouter.go('/depositlist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavnewdeposit': function(event) {
        event.preventDefault();
        FlowRouter.go('/depositcard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #sidenavshipping': function(event) {
        event.preventDefault();
        FlowRouter.go('/vs1shipping');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click #closeCloudSidePanelMenu': function(event) {
        let templateObject = Template.instance();
        let empLoggedID = Session.get('mySessionEmployeeLoggedID');
        let accesslevelService = new AccessLevelService();
        let isSidePanel = false;
        let sidePanelID = Session.get('CloudSidePanelMenuID');
        let sidePanelFormID = Session.get('CloudSidePanelMenuFormID');

        let data = {
            type: "TEmployeeFormAccess",
            fields: {
                ID: sidePanelID,
                EmployeeId: empLoggedID,
                AccessLevel: 6,
                FormId: sidePanelFormID
            }
        }

        accesslevelService.saveEmpAccess(data).then(function(data) {
            Session.setPersistent('CloudSidePanelMenu', isSidePanel);

            Meteor._reload.reload();
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

        });

    },
    'click .accountsLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/accountsoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .appointmentsLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/appointments');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .bankingLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/bankingoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .contactsLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/contactoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .crmLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/crmoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .inventoryLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/inventorylist');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .paymentsLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/paymentoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .payrollLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/payrolloverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .receiptLiHeader': function(event) {
      event.preventDefault();
      FlowRouter.go('/receiptsoverview');
      let templateObject = Template.instance();
      templateObject.getSetSideNavFocus();
    },
    'click .purchasesLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/purchasesoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .reportsLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/allreports');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .reportsLi2Header': function(event) {
        event.preventDefault();
        FlowRouter.go('/allreports');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .salesLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/salesoverview');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .seedtosaleLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/stsdashboard');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    },
    'click .settingsLiHeader': function(event) {
        event.preventDefault();
        FlowRouter.go('/settings');
        let templateObject = Template.instance();
        templateObject.getSetSideNavFocus();
    }

});
Template.newsidenav.helpers({
    includeDashboard: () => {
        return Template.instance().includeDashboard.get();
    },
    includeMain: () => {
        return Template.instance().includeMain.get();
    },
    includeInventory: () => {
        return Template.instance().includeInventory.get();
    },
    includeManufacturing: () => {
        return Template.instance().includeManufacturing.get();
    },
    includeAccessLevels: () => {
        return Template.instance().includeAccessLevels.get();
    },
    includeShipping: () => {
        return Template.instance().includeShipping.get();
    },
    includeStockTransfer: () => {
        return Template.instance().includeStockTransfer.get();
    },
    includeStockAdjustment: () => {
        return Template.instance().includeStockAdjustment.get();
    },
    includeStockTake: () => {
        return Template.instance().includeStockTake.get();
    },
    includeSales: () => {
        return Template.instance().includeSales.get();
    },
    isCloudSidePanelMenu: () => {
        return Template.instance().isCloudSidePanelMenu.get();
    },
    isCloudTopPanelMenu: () => {
        return Template.instance().isCloudTopPanelMenu.get();
    },
    includePurchases: () => {
        return Template.instance().includePurchases.get();
    },
    includeExpenseClaims: () => {
        return Template.instance().includeExpenseClaims.get();
    },
    includeFixedAssets: () => {
        return Template.instance().includeFixedAssets.get();
    },
    includePayments: () => {
        return Template.instance().includePayments.get();
    },
    includeContacts: () => {
        return Template.instance().includeContacts.get();
    },
    includeAccounts: () => {
        return Template.instance().includeAccounts.get();
    },
    includeReports: () => {
        return Template.instance().includeReports.get();
    },
    includeSettings: () => {
        return Template.instance().includeSettings.get();
    },
    formname: () => {
        let chequeSpelling = "";
        if (Session.get('ERPLoggedCountry') == "Australia") {
            chequeSpelling = "Cheque";
        } else if (Session.get('ERPLoggedCountry') == "United States of America") {
            chequeSpelling = "Check";
        } else {
            chequeSpelling = "Cheque";
        }
        return chequeSpelling;
    },
    isBalanceSheet: function() {
        return Template.instance().isBalanceSheet.get();
    },
    isProfitLoss: function() {
        return Template.instance().isProfitLoss.get();
    },
    isAgedReceivables: function() {
        return Template.instance().isAgedReceivables.get();
    },
    isAgedReceivablesSummary: function() {
        return Template.instance().isAgedReceivablesSummary.get();
    },
    isProductSalesReport: function() {
        return Template.instance().isProductSalesReport.get();
    },
    isSalesReport: function() {
        return Template.instance().isSalesReport.get();
    },
    isSalesSummaryReport: function() {
        return Template.instance().isSalesSummaryReport.get();
    },
    isGeneralLedger: function() {
        return Template.instance().isGeneralLedger.get();
    },
    isTaxSummaryReport: function() {
        return Template.instance().isTaxSummaryReport.get();
    },
    isTrialBalance: function() {
        return Template.instance().isTrialBalance.get();
    },
    is1099Transaction: function() {
        return Template.instance().is1099Transaction.get();
    },
    isAgedPayables: function() {
        return Template.instance().isAgedPayables.get();
    },
    isAgedPayablesSummary: function() {
        return Template.instance().isAgedPayablesSummary.get();
    },
    isPurchaseReport: function() {
        return Template.instance().isPurchaseReport.get();
    },
    isPurchaseSummaryReport: function() {
        return Template.instance().isPurchaseSummaryReport.get();
    },
    isPrintStatement: function() {
        return Template.instance().isPrintStatement.get();
    },
    isFavorite: function() {
        let isBalanceSheet = Template.instance().isBalanceSheet.get();
        let isProfitLoss = Template.instance().isProfitLoss.get();
        let isAgedReceivables = Template.instance().isAgedReceivables.get();
        let isAgedReceivablesSummary = Template.instance().isAgedReceivablesSummary.get();
        let isProductSalesReport = Template.instance().isProductSalesReport.get();
        let isSalesReport = Template.instance().isSalesReport.get();
        let isSalesSummaryReport = Template.instance().isSalesSummaryReport.get();
        let isGeneralLedger = Template.instance().isGeneralLedger.get();
        let isTaxSummaryReport = Template.instance().isTaxSummaryReport.get();
        let isTrialBalance = Template.instance().isTrialBalance.get();
        let is1099Transaction = Template.instance().is1099Transaction.get();
        let isAgedPayables = Template.instance().isAgedPayables.get();
        let isAgedPayablesSummary = Template.instance().isAgedPayablesSummary.get();
        let isPurchaseReport = Template.instance().isPurchaseReport.get();
        let isPurchaseSummaryReport = Template.instance().isPurchaseSummaryReport.get();
        let isPrintStatement = Template.instance().isPrintStatement.get();
        let isShowFavorite = false;

        if (isBalanceSheet || isProfitLoss || isAgedReceivables || isProductSalesReport || isSalesReport || isSalesSummaryReport ||
            isGeneralLedger || isTaxSummaryReport || isTrialBalance || is1099Transaction || isAgedPayables ||
            isPurchaseReport || isPurchaseSummaryReport || isPrintStatement || isAgedReceivablesSummary || isAgedPayablesSummary) {
            isShowFavorite = true;
        }
        return isShowFavorite;
    },
    isGreenTrack: function() {
        let checkGreenTrack = Session.get('isGreenTrack') || false;
        return checkGreenTrack;
    },
    includeSeedToSale: () => {
        return Template.instance().includeSeedToSale.get();
    },
    includeAppointmentScheduling: () => {
        return Template.instance().includeAppointmentScheduling.get();
    },
    includeBanking: () => {
        return Template.instance().includeBanking.get();
    },
    includePayroll: () => {
        return Template.instance().includePayroll.get();
    },
    includePayrollClockOnOffOnly: () => {
        return Template.instance().includePayrollClockOnOffOnly.get();
    },
    includeTimesheetEntry: () => {
        return Template.instance().includeTimesheetEntry.get();
    },
    includeClockOnOff: () => {
        return Template.instance().includeClockOnOff.get();
    },
    checkFXCurrency: () => {
        return Session.get('CloudUseForeignLicence');
    },
    showTimesheet : () => {
        return Session.get('CloudShowTimesheet') || false;
    },
});
