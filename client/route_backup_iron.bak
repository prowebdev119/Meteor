Router.configure({
    layout: 'layout',
    loadingTemplate: '',
    notFoundTemplate: 'not_found',
    onBeforeAction: function(r) {
        if (Session.get('CloudSidePanelMenu')) {
            $("html").addClass("hasSideBar");
            $("body").addClass("hasSideBar");
            // $("html").toggleClass("hasSideBar");
            // $("body").toggleClass("hasSideBar");
        }

        if (Session.get('sidePanelSettings') === "openNav") {
            $(".active_page_content").css("text-align", "right");
        } else {
            $(".active_page_content").css("text-align", "inherit");
        }
        if (Session.get('lastUrl') == undefined) {
            Session.setPersistent('lastUrl', window.location.pathname);
        } else {
            let lastUrl = Session.get('lastUrl');
            if (lastUrl != '/reports/aged-payables' && lastUrl !== '/apinfo') {
                localStorage.removeItem("adddedPayableItemStore");
            }
            if (lastUrl != '/reports/aged-receivables' && lastUrl !== '/arinfo') {
                localStorage.removeItem("addToReceivableReport");
            }
            if (lastUrl != '/reports/sales-by-item' && lastUrl !== '/item-transaction') {
                localStorage.removeItem("adddedItemStore");
            }
            if (lastUrl != '/reports/balance-sheet' && lastUrl !== '/balance-sheet-detail') {
                localStorage.removeItem("balanceSheetItemStore");
            }

            if (lastUrl != '/reports/generalLedgerReport/generalLedgerSummary' &&
                lastUrl !== '/reports/generalLedgerReport/generalLedgerExceptions' &&
                lastUrl !== '/generalLedgerDetail') {
                localStorage.removeItem("generalLedgerReport");
            }

            if (lastUrl != '/reports/income-by-contact' && lastUrl !== '/reports/income-transaction') {
                localStorage.removeItem("incomeTransactionItemStore");
            }
            if (lastUrl != '/reports/expense-by-contact' && lastUrl !== '/reports/expense-transaction') {
                localStorage.removeItem("expenseTransactionItemStore");
            }

            if (lastUrl != '/reports/aged-receivables-detail') {
                localStorage.removeItem("contactSelectedFields");
                localStorage.removeItem('allRecordData');
                localStorage.removeItem('contactGroupField');
                localStorage.removeItem('emailFilterField');
                localStorage.removeItem('invoiceNumberField');
                localStorage.removeItem('invoiceReferenceField');
                localStorage.removeItem('mobileFilterField');
                localStorage.removeItem('phoneFilterField');
                localStorage.removeItem('expectedDateFrom');
                localStorage.removeItem('expectedDateTo');
                localStorage.removeItem('dueDateFrom');
                localStorage.removeItem('dueDateTo');
                localStorage.removeItem('invoiceDateFrom');
                localStorage.removeItem('invoiceDateTo');
                localStorage.removeItem('layoutSecondValue');
            }

            if (lastUrl !== '/reports/receivable-invoice-detail') {
                localStorage.removeItem("invoiceContactField");
                localStorage.removeItem('contactGrpField');
                localStorage.removeItem('invoiceNumberData');
                localStorage.removeItem('invoiceReferenceData');
                localStorage.removeItem('fromExpectedDate');
                localStorage.removeItem('toExpectedDate');
                localStorage.removeItem('createdDateFrom');
                localStorage.removeItem('createdDateTo');
                localStorage.removeItem('fromDueDate');
                localStorage.removeItem('toDueDate');
                localStorage.removeItem('fromInvoiceDate');
                localStorage.removeItem('invoiceDateTo');
                localStorage.removeItem('dateSearch');
                localStorage.removeItem('invoiceDetailLayoutSecond');
            }

            if (lastUrl !== '/reports/receivable-invoice-summary') {
                localStorage.removeItem("summaryContactField");
                localStorage.removeItem('contactGrpSummary');
                localStorage.removeItem('summaryNumberData');
                localStorage.removeItem('summaryReferenceData');
                localStorage.removeItem('summaryExpectedFrom');
                localStorage.removeItem('summaryExpectedTo');
                localStorage.removeItem('summaryDuedateFrom');
                localStorage.removeItem('summaryDuedateTo');
                localStorage.removeItem('fromInvoiceDate');
                localStorage.removeItem('summaryInvoiceDateTo');
                localStorage.removeItem('summaryInvoiceDateFrom');
                localStorage.removeItem('dateSearchSumm');
                localStorage.removeItem('summarylayoutSecond');
            }

            if (lastUrl != '/reports/payable-invoice-detail') {
                localStorage.removeItem("payableContactField");
                localStorage.removeItem('payableSourceField');
                localStorage.removeItem('payableAcountsField');
                localStorage.removeItem('contactGroup');
                localStorage.removeItem('payableTotalTo');
                localStorage.removeItem('payableTotalFrom');
                localStorage.removeItem('payableGstFrom');
                localStorage.removeItem('payableGstTo');
                localStorage.removeItem('payableInvoiceReference');
                localStorage.removeItem('phoneFilterField');
                localStorage.removeItem('fromPlannedDate');
                localStorage.removeItem('toPlannedDate');
                localStorage.removeItem('payableDueFrom');
                localStorage.removeItem('payableDueTo');
                localStorage.removeItem('payFromInvDate');
                localStorage.removeItem('payToInvDate');
                localStorage.removeItem('payablelayoutSecond');
            }

            if (lastUrl != '/reports/payable-invoice-summary') {
                localStorage.removeItem("payInvContactField");
                localStorage.removeItem('payInvSourceField');
                localStorage.removeItem('payInvAcountsField');
                localStorage.removeItem('payInvcontactGroup');
                localStorage.removeItem('payInvTotalTo');
                localStorage.removeItem('payInvTotalFrom');
                localStorage.removeItem('payInvGstFrom');
                localStorage.removeItem('payInvGstTo');
                localStorage.removeItem('payInvReference');
                localStorage.removeItem('payInvfromPlanned');
                localStorage.removeItem('payInvToPlanned');
                localStorage.removeItem('payInvDueFrom');
                localStorage.removeItem('payInvDueTo');
                localStorage.removeItem('payInvFromInvDate');
                localStorage.removeItem('payInvToInvDate');
                localStorage.removeItem('payInvLayoutSecond');
            }
        }
        Session.setPersistent('lastUrl', window.location.pathname);
        this.next();
    }

});

Router.route('/', {
    name: 'vs1login',
    template: 'vs1login'
});


Router.route('/vs1greentracklogin', {
    name: 'vs1greentracklogin',
    template: 'vs1greentracklogin'
});

Router.route('/vs1check', {
    name: 'vs1check',
    template: 'vs1check'
});

Router.route('/accounttransactions', {
    name: 'accounttransactions',
    template: 'accounttransactions',
    layoutTemplate: 'layout'
});

Router.route('/testlogin', {
    name: 'testlogin',
    template: 'testlogin'
});

Router.route('/forgot', {
    name: 'forgotforgot',
    template: 'forgot'
});
Router.route('/register', {
    name: 'register',
    template: 'register'
});

Router.route('/registerdb', {
    name: 'registerdb',
    template: 'registerdb'
});

Router.route('/binnypurchasedb', {
    name: 'binnypurchasedb',
    template: 'binnypurchasedb'
});

Router.route('/packagerenewal', {
    name: 'packagerenewal',
    template: 'packagerenewal'
});

Router.route('/simonpurchasedb', {
    name: 'simonpurchasedb',
    template: 'simonpurchasedb'
});

Router.route('/dashboard', {
    name: 'dashboard',
    template: 'dashboard',
    layoutTemplate: 'layout'
});

Router.route('/appointments', {
    name: 'appointments',
    template: 'appointments',
    layoutTemplate: 'layout'
});

Router.route('/appointmenttimelist', {
    name: 'appointmenttimelist',
    template: 'appointmenttimelist',
    layoutTemplate: 'layout'
});

Router.route('/newappointments', {
    name: 'newappointments',
    template: 'newappointments',
    layoutTemplate: 'layout'
});

// Router.route('/newso',{
//   name: 'newso',
//   template: 'newso',
//   layoutTemplate: 'layout'
// });
/* Sales */
Router.route('/salesordercard', {
    name: 'new_salesorder',
    template: 'new_salesorder',
    layoutTemplate: 'layout'
});

Router.route('/invoicecard', {
    name: 'new_invoice',
    template: 'new_invoice',
    layoutTemplate: 'layout'
});

Router.route('/refundcard', {
    name: 'refundcard',
    template: 'refundcard',
    layoutTemplate: 'layout'
});



Router.route('/quotecard', {
    name: 'new_quote',
    template: 'new_quote',
    layoutTemplate: 'layout'
});

Router.route('/salesorderslist', {
    name: 'salesorderslist',
    template: 'salesorderslist',
    layoutTemplate: 'layout'
});

Router.route('/invoicelist', {
    name: 'invoicelist',
    template: 'invoicelist',
    layoutTemplate: 'layout'
});

Router.route('/invoicelistBO', {
    name: 'invoicelistBO',
    template: 'invoicelistBO',
    layoutTemplate: 'layout'
});
Router.route('/quoteslist', {
    name: 'quoteslist',
    template: 'quoteslist',
    layoutTemplate: 'layout'
});

/*Overviews*/
Router.route('/accountsoverview', {
    name: 'accountsoverview',
    template: 'accountsoverview',
    layoutTemplate: 'layout'
});

Router.route('/payrolloverview', {
    name: 'payrolloverview',
    template: 'payrolloverview',
    layoutTemplate: 'layout'
});

Router.route('/purchasesoverview', {
    name: 'purchasesoverview',
    template: 'purchasesoverview',
    layoutTemplate: 'layout'
});

Router.route('/salesoverview', {
    name: 'salesoverview',
    template: 'salesoverview',
    layoutTemplate: 'layout'
});

Router.route('/contactoverview', {
    name: 'contactoverview',
    template: 'contactoverview',
    layoutTemplate: 'layout'
});

Router.route('/billcard', {
    name: 'billcard',
    template: 'billcard',
    layoutTemplate: 'layout'
});

Router.route('/chequecard', {
    name: 'chequecard',
    template: 'chequecard',
    layoutTemplate: 'layout'
});

/* Contacts */
Router.route('/customerscard', {
    name: 'customerscard',
    template: 'customerscard',
    layoutTemplate: 'layout'
});

Router.route('/employeescard', {
    name: 'employeescard',
    template: 'employeescard',
    layoutTemplate: 'layout'
});

Router.route('/supplierscard', {
    name: 'supplierscard',
    template: 'supplierscard',
    layoutTemplate: 'layout'
});

Router.route('/customerlist', {
    name: 'customerlist',
    template: 'customerlist',
    layoutTemplate: 'layout'
});

Router.route('/invoiceemail', {
    name: 'invoiceemail',
    template: 'invoiceemail',
    layoutTemplate: 'layout'
});

Router.route('/joblist', {
    name: 'joblist',
    template: 'joblist',
    layoutTemplate: 'layout'
});

Router.route('/statementlist', {
    name: 'statementlist',
    template: 'statementlist',
    layoutTemplate: 'layout'
});



Router.route('/employeelist', {
    name: 'employeelist',
    template: 'employeelist',
    layoutTemplate: 'layout'
});

Router.route('/supplierlist', {
    name: 'supplierlist',
    template: 'supplierlist',
    layoutTemplate: 'layout'
});
/* Chart of Accounts */
Router.route('/chartofaccounts', {
    name: 'chartofaccounts',
    template: 'chartofaccounts',
    layoutTemplate: 'layout'
});

/* Expense Claim */
Router.route('/expenseclaims', {
    name: 'expenseclaims',
    template: 'expenseclaims',
    layoutTemplate: 'layout'
});

/* Purchases */
Router.route('purchaseorderlist', {
    name: 'purchaseorderlist',
    template: 'purchaseorderlist',
    render: 'purchaseorderlist',
    layoutTemplate: 'layout'
});

Router.route('purchaseorderlistBO', {
    name: 'purchaseorderlistBO',
    template: 'purchaseorderlistBO',
    render: 'purchaseorderlistBO',
    layoutTemplate: 'layout'
});

Router.route('/purchaseordercard', {
    name: 'purchaseordercard',
    template: 'purchaseordercard',
    layoutTemplate: 'layout'
});

Router.route('/billlist', {
    name: 'billlist',
    template: 'billlist',
    layoutTemplate: 'layout'
});

Router.route('/chequelist', {
    name: 'chequelist',
    template: 'chequelist',
    layoutTemplate: 'layout'
});

Router.route('/creditlist', {
    name: 'creditlist',
    template: 'creditlist',
    layoutTemplate: 'layout'
});

/* Inventory */
Router.route('/inventorylist', {
    name: 'inventorylist',
    template: 'inventorylist',
    layoutTemplate: 'layout'
});

Router.route('/productlist', {
    name: 'productlist',
    template: 'productlist',
    layoutTemplate: 'layout'
});

Router.route('/forgotpassword');
// Router.route('/Password/Reset', function(){
//     this.render('resetpassword');
// });

Router.route('/resetpassword', {
    name: 'resetpassword',
    template: 'resetpassword'
});

// Router.route('/viewpayment', {
//     name: 'viewpayment',
//     template: 'viewpayment',
//     layoutTemplate: 'layout'
// });

/* Payments */
Router.route('/paymentcard', {
    name: 'paymentcard',
    template: 'paymentcard',
    layoutTemplate: 'layout'
});

Router.route('/supplierpaymentcard', {
    name: 'supplierpaymentcard',
    template: 'supplierpaymentcard',
    layoutTemplate: 'layout'
});



/* Settings */
Router.route('/settings', {
    name: 'settings',
    template: 'settings',
    layoutTemplate: 'layout'
});

Router.route('organisationsettings', {
    name: 'organisationsettings',
    template: 'organisationsettings',
    layoutTemplate: 'layout'
});

Router.route('accesslevel', {
    name: 'accesslevel',
    template: 'accesslevel',
    render: 'accesslevel',
    layoutTemplate: 'layout'
});

Router.route('companyappsettings', {
    name: 'companyappsettings',
    template: 'companyappsettings',
    render: 'companyappsettings',
    layoutTemplate: 'layout'
});

/* Reports */
Router.route('balancesheetreport', {
    name: 'balancesheetreport',
    template: 'balancesheetreport',
    render: 'balancesheetreport',
    layoutTemplate: 'layout'
});

Router.route('balancetransactionlist', {
    name: 'balancetransactionlist',
    template: 'balancetransactionlist',
    render: 'balancetransactionlist',
    layoutTemplate: 'layout'
});

Router.route('allreports', {
    name: 'allreports',
    template: 'allreports',
    render: 'allreports',
    layoutTemplate: 'layout'
});

Router.route('/productsalesreport', {
    name: 'productsalesreport',
    template: 'productsalesreport',
    layoutTemplate: 'layout'
});

Router.route('/salesreport', {
    name: 'salesreport',
    template: 'salesreport',
    layoutTemplate: 'layout'
});


Router.route('/salessummaryreport', {
    name: 'salessummaryreport',
    template: 'salessummaryreport',
    layoutTemplate: 'layout'
});


Router.route('/profitlossreport', {
    name: 'profitlossreport',
    template: 'profitlossreport',
    layoutTemplate: 'layout'
});

Router.route('/taxsummaryreport', {
    name: 'taxsummaryreport',
    template: 'taxsummaryreport',
    layoutTemplate: 'layout'
});

Router.route('/productview', {
    name: 'productview',
    template: 'productview',
    layoutTemplate: 'layout'
});

Router.route('/paymentoverview', {
    name: 'paymentoverview',
    template: 'paymentoverview',
    layoutTemplate: 'layout'
});

Router.route('/bankingoverview', {
    name: 'bankingoverview',
    template: 'bankingoverview',
    layoutTemplate: 'layout'
});

Router.route('/reconciliation', {
    name: 'reconciliation',
    template: 'reconciliation',
    layoutTemplate: 'layout'
});

Router.route('/reconciliationlist', {
    name: 'reconciliationlist',
    template: 'reconciliationlist',
    layoutTemplate: 'layout'
});

Router.route('/appointmentlist', {
    name: 'appointmentlist',
    template: 'appointmentlist',
    layoutTemplate: 'layout'
});

Router.route('/customerawaitingpayments', {
    name: 'customerawaitingpayments',
    template: 'customerawaitingpayments',
    layoutTemplate: 'layout'
});

Router.route('/customerpayment', {
    name: 'customerpayment',
    template: 'customerpayment',
    layoutTemplate: 'layout'
});

Router.route('/supplierawaitingpurchaseorder', {
    name: 'supplierawaitingpurchaseorder',
    template: 'supplierawaitingpurchaseorder',
    layoutTemplate: 'layout'
});

Router.route('/supplierawaitingbills', {
    name: 'supplierawaitingbills',
    template: 'supplierawaitingbills',
    layoutTemplate: 'layout'
});

Router.route('/supplierbills', {
    name: 'supplierbills',
    template: 'supplierbills',
    layoutTemplate: 'layout'
});

Router.route('/supplierpayment', {
    name: 'supplierpayment',
    template: 'supplierpayment',
    layoutTemplate: 'layout'
});

Router.route('/formnewbill', {
    name: 'formnewbill',
    template: 'formnewbill',
    layoutTemplate: 'layout'
});

Router.route('/creditcard', {
    name: 'creditcard',
    template: 'creditcard',
    layoutTemplate: 'layout'
});

Router.route('/agedpayables', {
    name: 'agedpayables',
    template: 'agedpayables',
    layoutTemplate: 'layout'
});

Router.route('/agedpayablessummary', {
    name: 'agedpayablessummary',
    template: 'agedpayablessummary',
    layoutTemplate: 'layout'
});

Router.route('/agedreceivables', {
    name: 'agedreceivables',
    template: 'agedreceivables',
    layoutTemplate: 'layout'
});

Router.route('/agedreceivablessummary', {
    name: 'agedreceivablessummary',
    template: 'agedreceivablessummary',
    layoutTemplate: 'layout'
});

Router.route('/trialbalance', {
    name: 'trialbalance',
    template: 'trialbalance',
    layoutTemplate: 'layout'
});

Router.route('/currenciesSettings', {
    name: 'currenciesSettings',
    template: 'currenciesSettings',
    layoutTemplate: 'layout'
});

Router.route('/taxratesettings', {
    name: 'taxRatesSettings',
    template: 'taxRatesSettings',
    layoutTemplate: 'layout'
});

Router.route('/generalledger', {
    name: 'generalledger',
    template: 'generalledger',
    layoutTemplate: 'layout'
});

Router.route('/1099report', {
    name: 'report1099',
    template: 'report1099',
    layoutTemplate: 'layout'
});

Router.route('/printstatement', {
    name: 'printstatement',
    template: 'printstatement',
    layoutTemplate: 'layout'
});

Router.route('/purchasesreport', {
    name: 'purchasesreport',
    template: 'purchasesreport',
    layoutTemplate: 'layout'
});

Router.route('/purchasesummaryreport', {
    name: 'purchasesummaryreport',
    template: 'purchasesummaryreport',
    layoutTemplate: 'layout'
});

Router.route('/departmentSettings', {
    name: 'departmentSettings',
    template: 'departmentSettings',
    layoutTemplate: 'layout'
});

Router.route('/clienttypesettings', {
    name: 'clienttypesettings',
    template: 'clienttypesettings',
    layoutTemplate: 'layout'
});

Router.route('/paymentmethodSettings', {
    name: 'paymentmethodSettings',
    template: 'paymentmethodSettings',
    layoutTemplate: 'layout'
});

Router.route('/termsettings', {
    name: 'termsettings',
    template: 'termsettings',
    layoutTemplate: 'layout'
});

Router.route('/stockAdjustmentOverview', {
    name: 'stockadjustmentoverview',
    template: 'stockadjustmentoverview',
    layoutTemplate: 'layout'
});
Router.route('/stockadjustmentcard', {
    name: 'stockadjustmentcard',
    template: 'stockadjustmentcard',
    layoutTemplate: 'layout'
});
Router.route('/journalentrycard', {
    name: 'journalentrycard',
    template: 'journalentrycard',
    layoutTemplate: 'layout'
});
Router.route('/journalentrylist', {
    name: 'journalentrylist',
    template: 'journalentrylist',
    layoutTemplate: 'layout'
});
Router.route('/timesheet', {
    name: 'timesheet',
    template: 'timesheet',
    layoutTemplate: 'layout'
});

Router.route('/squareapi', {
    name: 'squareapi',
    template: 'squareapi',
    layoutTemplate: 'layout'
});

Router.route('/paychexapi', {
    name: 'paychexapi',
    template: 'paychexapi',
    layoutTemplate: 'layout'
});

Router.route('/adpapi', {
    name: 'adpapi',
    template: 'adpapi',
    layoutTemplate: 'layout'
});

Router.route('/stsdashboard', {
    name: 'stsdashboard',
    template: 'stsdashboard',
    layoutTemplate: 'layout'
});

Router.route('/stsplants', {
    name: 'stsplants',
    template: 'stsplants',
    layoutTemplate: 'layout'
});

Router.route('/stsharvests', {
    name: 'stsharvests',
    template: 'stsharvests',
    layoutTemplate: 'layout'
});

Router.route('/stspackages', {
    name: 'stspackages',
    template: 'stspackages',
    layoutTemplate: 'layout'
});

Router.route('/stsoverviews', {
    name: 'stsoverviews',
    template: 'stsoverviews',
    layoutTemplate: 'layout'
});

Router.route('/stscreateplantings', {
    name: 'stscreateplantings',
    template: 'stscreateplantings',
    layoutTemplate: 'layout'
});

Router.route('/stschangegrowthphase', {
    name: 'stschangegrowthphase',
    template: 'stschangegrowthphase',
    layoutTemplate: 'layout'
});

Router.route('/stsrecordadditives', {
    name: 'stsrecordadditives',
    template: 'stsrecordadditives',
    layoutTemplate: 'layout'
});

Router.route('/stschangeroom', {
    name: 'stschangeroom',
    template: 'stschangeroom',
    layoutTemplate: 'layout'
});

Router.route('/stsmanicureplants', {
    name: 'stsmanicureplants',
    template: 'stsmanicureplants',
    layoutTemplate: 'layout'
});

Router.route('/stsdestroyplants', {
    name: 'stsdestroyplants',
    template: 'stsdestroyplants',
    layoutTemplate: 'layout'
});

Router.route('/ststaghistory', {
    name: 'ststaghistory',
    template: 'ststaghistory',
    layoutTemplate: 'layout'
});

Router.route('/stscreateharvests', {
    name: 'stscreateharvests',
    template: 'stscreateharvests',
    layoutTemplate: 'layout'
});

Router.route('/stsharvestlist', {
    name: 'stsharvestlist',
    template: 'stsharvestlist',
    layoutTemplate: 'layout'
});

Router.route('/stscreatepackagefromharvest', {
    name: 'stscreatepackagefromharvest',
    template: 'stscreatepackagefromharvest',
    layoutTemplate: 'layout'
});

Router.route('/stscreatepackagefrompackages', {
    name: 'stscreatepackagefrompackages',
    template: 'stscreatepackagefrompackages',
    layoutTemplate: 'layout'
});

Router.route('/stscreatepackagesfromharvest', {
    name: 'stscreatepackagesfromharvest',
    template: 'stscreatepackagesfromharvest',
    layoutTemplate: 'layout'
});

Router.route('/stspackagelist', {
    name: 'stspackagelist',
    template: 'stspackagelist',
    layoutTemplate: 'layout'
});

Router.route('/stsactivitylog', {
    name: 'stsactivitylog',
    template: 'stsactivitylog',
    layoutTemplate: 'layout'
});

Router.route('/ststagorderlist', {
    name: 'ststagorderlist',
    template: 'ststagorderlist',
    layoutTemplate: 'layout'
});

Router.route('/stsactiveinventory', {
    name: 'stsactiveinventory',
    template: 'stsactiveinventory',
    layoutTemplate: 'layout'
});

Router.route('/stssettings', {
    name: 'stssettings',
    template: 'stssettings',
    layoutTemplate: 'layout'
});

Router.route('/ststransfers', {
    name: 'ststransfers',
    template: 'ststransfers',
    layoutTemplate: 'layout'
});

Router.route('/stscreatetransfer', {
    name: 'stscreatetransfer',
    template: 'stscreatetransfer',
    layoutTemplate: 'layout'
});

Router.route('/stsaddtransfercontent', {
    name: 'stsaddtransfercontent',
    template: 'stsaddtransfercontent',
    layoutTemplate: 'layout'
});

Router.route('/ststransferhistory', {
    name: 'ststransferhistory',
    template: 'ststransferhistory',
    layoutTemplate: 'layout'
});

Router.route('/stsprintlabels', {
    name: 'stsprintlabels',
    template: 'stsprintlabels',
    layoutTemplate: 'layout'
});

Router.route('/stslocationoverview', {
    name: 'stslocationoverview',
    template: 'stslocationoverview',
    layoutTemplate: 'layout'
});

Router.route('/stsoutgoingorders', {
    name: 'stsoutgoingorders',
    template: 'stsoutgoingorders',
    layoutTemplate: 'layout'
});

Router.route('/featureallocation', {
    name: 'featureallocation',
    template: 'featureallocation',
    layoutTemplate: 'layout'
});

Router.route('/registersts', {
    name: 'registersts',
    template: 'registersts'
});

Router.route('/bankrecon', {
    name: 'bankrecon',
    template: 'bankrecon',
    layoutTemplate: 'layout'
});

Router.route('/depositcard', {
    name: 'depositcard',
    template: 'depositcard',
    layoutTemplate: 'layout'
});

Router.route('/depositlist', {
    name: 'depositlist',
    template: 'depositlist',
    layoutTemplate: 'layout'
});

Router.route('/linktrueerp', {
    name: 'linktrueerp',
    template: 'linktrueerp',
    layoutTemplate: 'layout'
});

Router.route('/subscriptionSettings', {
    name: 'subscriptionSettings',
    template: 'subscriptionSettings',
    layoutTemplate: 'layout'
});

Router.route('/employeetimeclock', {
    name: 'employeetimeclock',
    template: 'employeetimeclock',
    layoutTemplate: 'layout'
});

Router.route('/vs1shipping', {
    name: 'vs1shipping',
    template: 'vs1shipping',
    layoutTemplate: 'layout'
});

Router.route('/shippingdocket', {
    name: 'shippingdocket',
    template: 'shippingdocket',
    layoutTemplate: 'layout'
});

// Router.route('/settings/accesslevel', function(){
//     this.render('accesslevel');
// });
// Router.route('/customerpaymentcard/:id', function(){
//     this.render('customerpaymentcard');
// });
/*
Router.route('/marketing');
Router.route('/crm');
Router.route('/inventory');
Router.route('/sales');
Router.route('/reminders');
Router.route('/reports');
Router.route('/home');
Router.route('/notify');
Router.route('/messages');
Router.route('/connection');
Router.route('/todolist');
Router.route('/reminderslist');
Router.route('/createproduct');
Router.route('/productexpresslist');
Router.route('/newcustomer');
Router.route('/newsupplier');
Router.route('/newemployee');
Router.route('/newquote');


Router.route('/newsalesorder');
Router.route('/newinvoice');
Router.route('/quoteslist');

Router.route('/solist');
Router.route('/refunds');
Router.route('/backorders');
Router.route('/profile');
Router.route('/prospects');
Router.route('/prospectlist');
Router.route('/mailmerge');
Router.route('/mailmergelist');
Router.route('/loyaltyprograms');
Router.route('/loyaltyprogramlist');
Router.route('/crmreports');
Router.route('/rewardpoints');
Router.route('/customercard');
Router.route('/newpo');
Router.route('/polist');
Router.route('/deliveryscan');
Router.route('/deliverylist');
Router.route('/stockscan');
Router.route('/stockscancard');
Router.route('/stockadjlist');
Router.route('/productcard');
Router.route('/quotecard');
Router.route('/salesordercard');
Router.route('/salesordersentcard');
Router.route('/invoicecard');
Router.route('/invoicecardawaitingapproval');
Router.route('/invoicecardawaitingpayment');
Router.route('/invoicepaidcard');
Router.route('/pocard');
Router.route('/socard');
Router.route('/purchases');
Router.route('/billslist/:tab', function(){
    this.render('billslist');
});
Router.route('/invoicelist/:tab', function(){
    this.render('invoicelist');
});
Router.route('/reports/generalLedgerReport/:tab', function(){
    this.render('generalLedgerReport');
});
Router.route('/generalLedgerDetail');
Router.route('/billadd');
Router.route('/billcard');
Router.route('/billview');
Router.route('/billedit');
Router.route('/allcontacts');
Router.route('/customerlist');
Router.route('/supplierslist');
Router.route('/employeelist');
Router.route('/archivedlist');
Router.route('/traininglist');
Router.route('/conpurchasedlist');
Router.route('/conoutstanding');
Router.route('/conoverdue');
Router.route('/conpaid');
Router.route('/refundlist');
Router.route('/creditnotelist');
Router.route('/bankaccounts');
Router.route('/expenseclaims/:tab',function(){
    this.render('expenseclaims');
});
Router.route('/fixedassets/:tab',function(){
    this.render('fixedassets');
});
Router.route('/fixedassets/registered', function(){
    this.render('fixedRegistered');
});
Router.route('/payrolloverview');
Router.route('/payrollemployees');
Router.route('/payrolltimeoff');
Router.route('/payrolltimesheets');
Router.route('/payrollpayruns');
Router.route('/pensionfiling');
Router.route('/rtifiling');
Router.route('/taxesfiling');
Router.route('/allreports');
Router.route('/agedpayables');
Router.route('/profitloss');
Router.route('/profitLossReport');
Router.route('/vatreturn');
Router.route('/advisermanualjournals');
Router.route('/adviserexport');
Router.route('/adviserhistorynotes');
Router.route('/adviserassurancedash');
Router.route('/adviserfindrecode');
Router.route('/settings', function(){
    this.render('generalsettings');
});
Router.route('/settings/organisation', function(){
    this.render('organisationSettings');
});
Router.route('/settings/accesslevel', function(){
    this.render('accesslevel');
});
Router.route('/settings/accounts/:tab', function(){
    this.render('chartOfAccountSettings');
});
Router.route('/settings/payroll', function(){
    this.render('payrollSettings');
});
Router.route('/settings/financial', function(){
    this.render('financialSettings');
});
Router.route('/settings/conversionBalances', function(){
    this.render('conversionBalancesSettings');
});
Router.route('/settings/users', function(){
    this.render('usersSettings');
});
Router.route('/settings/taxRates', function(){
    this.render('taxRatesSettings');
});
Router.route('/settings/customContactLinks', function(){
    this.render('customContactLinksSettings');
});
Router.route('/settings/invoice', function(){
    this.render('invoiceSettings');
});
Router.route('/settings/currencies', function(){
    this.render('currenciesSettings');
});
Router.route('/settings/payItems', function(){
    this.render('payItemsSettings');
});
Router.route('/settings/fixedAssets/:tab', function(){
    this.render('fixedAssetsSettings');
});
Router.route('/settings/email', function(){
    this.render('emailSettings');
});
Router.route('/settings/tracking', function(){
    this.render('trackingSettings');
});
Router.route('/settings/trueERP-to-trueERP', function(){
    this.render('trueERPSettings');
});
Router.route('/settings/connectedApps', function(){
    this.render('connectedAppsSettings');
});
Router.route('/settings/payment', function(){
    this.render('paymentServicesSettings');
});

Router.route('/productexpresslist/Import', function(){
    this.render('importitems');
});

Router.route('/productexpresslist/ImportOpeningBalances', function(){
    this.render('import_OpeningBalance');
});

Router.route('/purchases/ImportBills', function(){
    this.render('importBills');
});

Router.route('/Banking/Account/select/spend', function(){
    this.render('spendmoney');
});
Router.route('/Banking/Account/select/receive', function(){
    this.render('receivemoney');
});
Router.route('/Banking/Account/select/transfer', function(){
    this.render('transfermoney');
});

Router.route('/settings/user', function(){
    this.render('userProfile');
});
Router.route('/settings/myAccount', function(){
    this.render('myAccount');
});

Router.route('/bank/bankRules', function(){
    this.render('bankRules');
});
Router.route('/bank/spendMoneyrules', function(){
    this.render('spendMoneyrules');
});
Router.route('/bank/receiveMoneyrules', function(){
    this.render('receiveMoneyrules');
});
Router.route('/bank/transferMoneyrules', function(){
    this.render('transferMoneyrules');
});
Router.route('/bank/StatementLines', function(){
    this.render('StatementLines');
});
Router.route('/bank/transactions', function(){
    this.render('transactions');
});
Router.route('/bank/bank-transactions', function(){
    this.render('business-bank-transactions');
});

Router.route('/expenses/receipts/:id', function(){
    this.render('addReceipt');
});
Router.route('/reports/bank-summary', function(){
    this.render('bankSummary');
});
Router.route('/reports/balance-sheet', function(){
    this.render('balanceSheet');
});
Router.route('/reports/budget-manager', function(){
    this.render('budgetManager');
});
Router.route('/reports/cash-summary', function(){
    this.render('cashSummary');
});
Router.route('/reports/movements-equity', function(){
    this.render('movementsEquity');
});
Router.route('/reports/profit-and-loss', function(){
    this.render('profitLoss');
});
Router.route('/reports/profit-and-loss-report', function(){
    this.render('profitLossReport');
});
Router.route('/reports/overall-budget', function(){
    this.render('overallBudget');
});
Router.route('/reports/budget-variance', function(){
    this.render('budgetVariance');
});
Router.route('/reports/business-performance', function(){
    this.render('businessPerformance');
});
Router.route('/reports/executive-summary', function(){
    this.render('executiveSummary');
});
Router.route('/reports/statement-cash-flows', function(){
    this.render('statementCashFlows');
});
Router.route('/reports/tracking-summary', function(){
    this.render('trackingSummary');
});
Router.route('/reports/aged-receivables', function(){
    this.render('agedReceivables');
});
Router.route('/reports/aged-receivables-detail', function(){
    this.render('agedReceivablesDetail');
});
Router.route('/reports/customer-invoice-report', function(){
    this.render('customerInvoiceReport');
});
Router.route('/reports/aged-receivables-summary', function(){
    this.render('agedReceivablesSummary');
});
Router.route('/reports/income-by-contact', function(){
    this.render('incomeByContact');
});
Router.route('/reports/income-transaction', function(){
    this.render('incomeTransaction');
});

Router.route('/reports/expense-by-contact', function(){
    this.render('expensesByContact');
});

Router.route('/reports/expense-transaction', function(){
    this.render('expenseTransaction');
});

Router.route('/reports/receivable-invoice-detail', function(){
    this.render('receivableInvoiceDetail');
});

Router.route('/reports/receivable-invoice-summary', function(){
    this.render('receivableInvoiceSummary');
});
Router.route('/reports/activity-statement', function(){
    this.render('activityStatement');
});
Router.route('/reports/gst-reconciliation', function(){
    this.render('gstReconciliation');
});

Router.route('/reports/taxable-payments-annual-report', function(){
    this.render('taxablePaymentsAnnualReport');
});
Router.route('/reports/account-transactions', function(){
    this.render('accountTransactions');
});

Router.route('/reports/bank-reconciliation', function(){
    this.render('bankReconciliation');
});
Router.route('/reports/contact-transactions-summary', function(){
    this.render('contactTransactionsSummary');
});
Router.route('/reports/foreign-currency-gains-and-losses', function(){
    this.render('foreignCurrencyGainsAndLosses');
});

Router.route('/reports/journal-report', function(){
    this.render('journalReport');
});
Router.route('/reports/trial-balance', function(){
    this.render('trialBalance');
});
Router.route('/reports/account-summary', function(){
    this.render('accountSummary');
});
Router.route('/reports/detailed-account-transaction-report', function(){
    this.render('detailedAccountTransactionReport');
});
Router.route('/reports/annual-report', function(){
    this.render('annualReport');
});
Router.route('/reports/management-report', function(){
    this.render('managementReport');
});
Router.route('/reports/reconciliation-reports', function(){
    this.render('reconciliationReports');
});
Router.route('/reports/aged-payables', function(){
    this.render('agedPayables');
});
Router.route('/reports/aged-payables-detail', function(){
    this.render('agedPayablesDetail');
});
Router.route('/reports/billable-expenses-outstanding', function(){
    this.render('billableExpensesOutstanding');
});
Router.route('/reports/supplier-invoice-report', function(){
    this.render('supplierInvoiceReport');
});
Router.route('/reports/aged-payables-summary', function(){
    this.render('agedPayablesSummary');
});
Router.route('/reports/expense-claim-detail', function(){
    this.render('expenseClaimDetail');
});
Router.route('/reports/expenses-by-contact', function(){
    this.render('expensesByContact');
});
Router.route('/reports/payable-invoice-detail', function(){
    this.render('payableInvoiceDetail');
});
Router.route('/reports/payable-invoice-summary', function(){
    this.render('payableInvoiceSummary');
});
Router.route('/reports/depreciation-schedule', function(){
    this.render('depreciationSchedule');
});
Router.route('/reports/fixed-asset-reconciliation', function(){
    this.render('fixedAssetReconciliation');
});
Router.route('/reports/disposal-schedule', function(){
    this.render('disposalSchedule');
});
Router.route('/reports/payroll-activity-details', function(){
    this.render('payrollActivityDetails');
});
Router.route('/reports/inventory-item-summary', function(){
    this.render('inventoryItemSummary');
});
Router.route('/reports/sales-by-item', function(){
    this.render('salesByItem');
});
Router.route('/reports/inventory-item-details', function(){
    this.render('inventoryItemDetails');
});
Router.route('/reports/inventory-item-list', function(){
    this.render('inventoryItemList');
});
Router.route('/reports/adelaide-hendricks', function(){
    this.render('adelaideHendricks');
});
Router.route('/fixedAssets/assets/:id', function(){
    this.render('addNewAsset');
});
Router.route('/Accounts/Payable/PurchaseOrders/View', function(){
    this.render('poview');
});

Router.route('/AccountsReceivable/EditCreditNote', function(){
    this.render('newcreditnote');
});

Router.route('/Accounts/Payable/PurchaseOrders/BilledView', function(){
    this.render('pobilledview');
});
Router.route('/expenses/expense-claim-summary', function(){
    this.render('expenseClaimSummary');
});
Router.route('/expenses/expense-claim-view', function(){
    this.render('expenseClaimView');
});
Router.route('/expenses/approve-expense-claim', function(){
    this.render('approveExpenseClaim');
});
Router.route('/fixedAssets/assets/summary/:id', function(){
    this.render('fixedRegistered');
});
Router.route('/fixedAssets/assets/sold-disposed/:id', function(){
    this.render('fixedSoldDisposed');
});
Router.route('/fixed-assets-settings/asset-type/:id', function(){
    this.render('fixedAssetEditAssetType');
});
Router.route('/fixed-assets-settings/pool/:id', function(){
    this.render('fixedAssetEditAddPool');
});
Router.route('/fixed-assets/run-depreciation', function(){
    this.render('runDepreciation');
});

Router.route('/fixedAssets/accounts/pools', function(){
    this.render('fixedAssetsPools');
});
Router.route('/fixed-assets/pool', function(){
    this.render('fixedAssetAddPool');
});

Router.route('/AccountsPayable/EditCreditNote/:id', function(){
    this.render('new_credit_note');
});

Router.route('/importfixedassets', function(){
    this.render('fixedassetsimport');
});
Router.route('/Import-budget', function(){
    this.render('ImportBudget');
});
Router.route('/settings/accounts/import-chart-account', function(){
    this.render('importChartAccount');
});
Router.route('/quote', function(){
    this.render('mailQuotePage');
});
Router.route('/invoice-share-page', function(){
    this.render('salesEmailFormat');
});
Router.route('/new-batch-payment', function(){
    this.render('newBatchPayment');
});
Router.route('/new-batch-deposit', function(){
    this.render('newBatchDeposit');
});
Router.route('/edit-repeating', function(){
    this.render('editRepeating');
});
Router.route('/new_repeating_bill', function(){
    this.render('newRepeatingBill');
});
Router.route('/Invoice_reminders', function(){
    this.render('InvoiceReminders');
});
Router.route('/publish-report', function(){
    this.render('PublishReport');
});

Router.route('/Import-your-chart-of-accounts', function(){
    this.render('ImportYourChartAccounts');
});
Router.route('addbankaccounts/account-details', function(){
    this.render('accountDetails');
});
Router.route('bank-accounts-summary', function(){
    this.render('bankAccountsSummary');
});

Router.route('bank-accounts', function(){
    this.render('bankAccounts');
});
Router.route('item-transaction', function(){
    this.render('itemTransaction');
});
Router.route('balance-sheet-info', function(){
    this.render('balanceSheetInfo');
});
Router.route('balance-sheet-detail', function(){
    this.render('balanceSheetDetail');
});

Router.route('trial-balance-detail', function(){
    this.render('trialBalanceDetail');
});

Router.route('/reports/cash-summary-detail', function(){
    this.render('cashSummaryDetail');
});
Router.route('account-summary-detail', function(){
    this.render('accountSummaryDetail');
});
Router.route('/sales/view-statement', function(){
    this.render('viewStatement');
});




Router.route('/files');
Router.route('/quotesentcard');
Router.route('/quoterevisecard');
Router.route('/salesorderrevisecard');
Router.route('/importitems');
Router.route('/suppliercard');
Router.route('/employeecard');
Router.route('/customeredit');
Router.route('/supplieredit');
Router.route('/employeeedit');
Router.route('/shipping');
Router.route('/shipquickInv');
Router.route('/shipquickSO');
Router.route('/manufacturing');
Router.route('/manufacturingquickSO');
Router.route('/arinfo');
Router.route('/apinfo');
Router.route('/allsales');
Router.route('/importinvoicefile');
Router.route('/addbankaccounts');
Router.route('/quotedeclinedcard');
Router.route('/quoteaccptedcard');
Router.route('/quoteinvoicedcard');
Router.route('/sosentcard');
Router.route('/billAwaitingApproval');
Router.route('/accesslevel');
Router.route('/manufacturinglist');
Router.route('/shippinglist');
Router.route('/stocktransfer');
Router.route('/stocktransferlist');
Router.route('/stocktake');
Router.route('/customerpaymentlist');
Router.route('/supplierpaymentlist');
Router.route('/customerpaymentcard/:id', function(){
    this.render('customerpaymentcard');
});
Router.route('/supplierpaymentcard/:id', function(){
    this.render('supplierpaymentcard');
});
Router.route('/awaitingcustomerpaylist');
Router.route('/awaitingsupplierpaylist');
Router.route('/customerslist');
Router.route('/supplierlist');
Router.route('/employeeslist');
Router.route('/stocktransfercard');
Router.route('/payments');
Router.route('/forgotpassword');
Router.route('/Password/Reset', function(){
    this.render('resetpassword');
});

*/
// Router.route('/vs1login');
