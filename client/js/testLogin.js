import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
import {AccessLevelService} from './accesslevel-service';
import {EmployeeProfileService} from './profile-service';
Template.testlogin.onCreated( () => {
   Template.instance().subscribe( 'RegisterUser' );
});
Template.testlogin.helpers({

    currentLoginEmail: function() {
          return Session.get('loginEmail') == this._email;
    },
    companyDatabases: function(){
      if(Session.get('loginEmail')){
       return RegisterUser.find({useremail: Session.get('loginEmail')}).fetch().sort(function (a, b) {
         if (a.description.toLowerCase() == 'NA') {
           return 1;
         }
         else if (b.description.toLowerCase() == 'NA') {
           return -1;
         }
         return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
       });

    }
  }
});

Template.testlogin.onCreated(function(){
  const templateObject = Template.instance();
   templateObject.loggedUser = new ReactiveVar();
   templateObject.loggedDB = new ReactiveVar();
   templateObject.steelmainDB = new ReactiveVar();
   templateObject.employeeID = new ReactiveVar();
   templateObject.employeeformID = new ReactiveVar();
   templateObject.employeeformDetail = new ReactiveVar();
   templateObject.employeeformaccessrecord = new ReactiveVar({});
});


Template.testlogin.onRendered(function(){
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



  Session.setPersistent('ERPCurrency', '');
  Session.setPersistent('ERPCountryAbbr', '');
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

  localStorage.setItem('vs1cloudlicenselevel', '');
  if ((localStorage.getItem('sidePanelToggle') === '') || (!localStorage.getItem('sidePanelToggle'))) {
    localStorage.setItem('sidePanelToggle', "toggled");
  }



  const templateObject = Template.instance();
  const arrayformid =[];
  const arrayformdet =[];
  let accesslevelService = new AccessLevelService();
  var employeeProfileService = new EmployeeProfileService();

  function getSideBarData(employeeID, accessUserName, accessDatabase,erpdbname){



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

    let isSidePanel = false;
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
    var ERPFormAccessDetailObject = "TEmployeeFormAccessDetail?ListType=Detail&Select=[TabGroup]=26 and [EmployeeId]='"+employeeID+"'";
    var oReqFormAccessDetailObject = new XMLHttpRequest();
    oReqFormAccessDetailObject.open("GET",URLRequest + SegsDatabase[0] + ':' + SegsDatabase[4] + '/' + "erpapi" + '/' + ERPFormAccessDetailObject, true);
    oReqFormAccessDetailObject.setRequestHeader("database",SegsDatabase[1]);
    oReqFormAccessDetailObject.setRequestHeader("username",SegsDatabase[2]);
    oReqFormAccessDetailObject.setRequestHeader("password",SegsDatabase[3]);
    oReqFormAccessDetailObject.send();

    oReqFormAccessDetailObject.onreadystatechange = function() {
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

          if(data.temployeeformaccessdetail[i].fields.AccessLevelName === "Full Access"){
            if(data.temployeeformaccessdetail[i].fields.Description === "Print Delivery Docket"){
              isDocket = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Print Invoice"){
              isInvoice = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "User Password Details"){
              isUserPassDetail = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "Dashboard"){
              isDashboard = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Main"){
              isMain = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking"){
              isInventory = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Manufacturing"){
              isManufacturing = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "Settings"){
              isAccessLevels = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Shipping"){
              isShipping = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer"){
              isStockTransfer = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Side Panel Menu"){
              isSidePanel = true;
              isSidePanelID = data.temployeeformaccessdetail[i].fields.ID;
              isSidePanelFormID = data.temployeeformaccessdetail[i].fields.FormId;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Top Panel Menu"){
              isTopPanel = true;
              isTopPanelID = data.temployeeformaccessdetail[i].fields.ID;
              isTopPanelFormID = data.temployeeformaccessdetail[i].fields.FormId;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Stock Take"){
              isStockTake = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Sales"){
              isSales = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Purchases"){
              isPurchases = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Expense Claims"){
              isExpenseClaims = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets"){
              isFixedAssets = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Payments"){
              isPayments = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Contacts"){
              isContacts = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Accounts"){

              isAccounts = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Reports"){
              isReports = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "Settings"){
              isSettings = true;
            }
            if(data.temployeeformaccessdetail[i].fields.Description === "View Dockets"){
              isViewDockets = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "Qty Only on Purchase Order"){
              isPurchaseQtyOnly = true;
            }

            if(data.temployeeformaccessdetail[i].fields.Description === "Qty Only on Sales"){
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
         if(!isDashboardLicence){
           isDashboard = false;
         }

         if(!isFixedAssetsLicence){
           isFixedAssets = false;
         }
         if(!isInventoryLicence){
           isInventory = false;
         }
         if(!isManufacturingLicence){
           isManufacturing = false;
         }
         if(!isPurchasesLicence){
           isPurchases = false;
         }
         if(!isSalesLicence){
           isSales = false;
         }
         if(!isShippingLicence){
           isShipping = false;
         }
         if(!isStockTakeLicence){
           isStockTake = false;
         }
         if(!isStockTransferLicence){
           isStockTransfer = false;
         }

         if(!isAccountsLicence){
           isAccounts = false;
         }
         if(!isContactsLicence){
           isContacts = false;
         }
         if(!isExpenseClaimsLicence){
           isExpenseClaims = false;
         }
         if(!isPaymentsLicence){
           isPayments = false;
         }
         if(!isReportsLicence){
           isReports = false;
         }

         if(!isSettingsLicence){
           isSettings = false;
         }

         if(!isMainLicence){
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

         let userSerssion = {'loggedEmpID':employeeID,
                             'loggedUserName':accessUserName,
                             'loggedDatabase':accessDatabase,
                             'loggedAccessData':lineItemslevel};
        Session.setPersistent('ERPSolidCurrentUSerAccess', userSerssion);

       let userModuleRedirect = lineItemsAccesslevel.sort(function (a, b) {
         if (a.description.toLowerCase() == 'NA') {
           return 1;
         }
         else if (b.description.toLowerCase() == 'NA') {
           return -1;
         }
         return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
       });






window.open('/dashboard','_self');

    }
    }

  }

  /* ERP Licence Info */
  function getERPLicenceInfo(erpdbname){
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

  function getAccessLevelData(userAccessOptions, isSameUserLogin){
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

    let isSidePanel = false;
    let isTopPanel = false;
    let isSidePanelID = '';
    let isTopPanelID = '';
    let isSidePanelFormID = '';
    let isTopPanelFormID = '';

    let isSeedToSale = true;
    let isBanking = true;
    let isPayroll = true;

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
       /*End Licence Check Menu to add */
    /* End Licence Check for menu option */

    if(userAccessOptions.items){

    $.each(userAccessOptions.items, function (itemaccess, optionaccess) {

          lineItemObjlevel = {
          formID: optionaccess.fields.FormId || '',
          accessLevel: optionaccess.fields.AccessLevel || '',
          accessLevelname: optionaccess.fields.AccessLevelName || '',
          description: optionaccess.fields.Description || '',
          formName: optionaccess.fields.FormName || '',
          accessID: optionaccess.fields.Id || '',
      };
      if(optionaccess.fields.AccessLevel === 1){
        if(optionaccess.fields.Description === "Print Delivery Docket"){
          isDocket = true;
        }
        if(optionaccess.fields.Description === "Print Invoice"){
          isInvoice = true;
        }

        if(optionaccess.fields.Description === "User Password Details"){
          isUserPassDetail = true;
        }

        if(optionaccess.fields.Description === "Dashboard"){
          isDashboard = true;
        }
        if(optionaccess.fields.Description === "Main"){
          isMain = true;
        }
        if(optionaccess.fields.Description === "Inventory" || optionaccess.fields.Description === "Inventory Tracking"){
          isInventory = true;
        }
        if(optionaccess.fields.Description === "Manufacturing"){
          isManufacturing = true;
        }

        if(optionaccess.fields.Description === "Settings"){
          isAccessLevels = true;
        }
        if(optionaccess.fields.Description === "Shipping"){
          isShipping = true;
        }
        if(optionaccess.fields.Description === "Stock Transfer"){
          isStockTransfer = true;
        }
        if(optionaccess.fields.Description === "Side Panel Menu"){
          isSidePanel = true;
          isSidePanelID = optionaccess.fields.ID;
          isSidePanelFormID = optionaccess.fields.FormId;
        }
        if(optionaccess.fields.Description === "Top Panel Menu"){
          isTopPanel = true;
          isTopPanelID = optionaccess.fields.ID;
          isTopPanelFormID = optionaccess.fields.FormId;
        }
        if(optionaccess.fields.Description === "Stock Take"){
          isStockTake = true;
        }
        if(optionaccess.fields.Description === "Sales"){
          isSales = true;
        }
        if(optionaccess.fields.Description === "Purchases"){
          isPurchases = true;
        }
        if(optionaccess.fields.Description === "Expense Claims"){
          isExpenseClaims = true;
        }
        if(optionaccess.fields.Description === "Fixed Assets"){
          isFixedAssets = true;
        }
        if(optionaccess.fields.Description === "Payments"){
          isPayments = true;
        }
        if(optionaccess.fields.Description === "Contacts"){
          isContacts = true;
        }
        if(optionaccess.fields.Description === "Accounts"){

          isAccounts = true;
        }
        if(optionaccess.fields.Description === "Reports"){
          isReports = true;
        }
        if(optionaccess.fields.Description === "Settings"){
          isSettings = true;
        }
        if(optionaccess.fields.Description === "View Dockets"){
          isViewDockets = true;
        }

        if(optionaccess.fields.Description === "Qty Only on Purchase Order"){
          isPurchaseQtyOnly = true;
        }

        if(optionaccess.fields.Description === "Qty Only on Sales"){
          isSalesQtyOnly = true;
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

    if(!isDashboardLicence){
      isDashboard = false;
    }

    if(!isFixedAssetsLicence){
      isFixedAssets = false;
    }
    if(!isInventoryLicence){
      isInventory = false;
    }
    if(!isManufacturingLicence){
      isManufacturing = false;
    }
    if(!isPurchasesLicence){
      isPurchases = false;
    }
    if(!isSalesLicence){
      isSales = false;
    }
    if(!isShippingLicence){
      isShipping = false;
    }
    if(!isStockTakeLicence){
      isStockTake = false;
    }
    if(!isStockTransferLicence){
      isStockTransfer = false;
    }
    if(!isAccountsLicence){
      isAccounts = false;
    }
    if(!isContactsLicence){
      isContacts = false;
    }
    if(!isExpenseClaimsLicence){
      isExpenseClaims = false;
    }
    if(!isPaymentsLicence){
      isPayments = false;
    }
    if(!isReportsLicence){
      isReports = false;
    }

    if(!isSettingsLicence){
      isSettings = false;
    }

    if(!isMainLicence){
      isMain = false;
    }

    if(!isSeedToSaleLicence){
      isSeedToSale = false;
    }

    if(!isBankingLicence){
      isBanking = false;
    }

    if(!isPayrollLicence){
      isPayroll = false;
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

   Session.setPersistent('CloudSeedToSaleModule', isSeedToSale);
   Session.setPersistent('CloudBankingModule', isBanking);
   Session.setPersistent('CloudPayrollModule', isPayroll);

    let userSerssion = {'loggedEmpID':userAccessOptions.items[0].fields.EmployeeId,
                        'loggedUserName':Session.get('EUserName'),
                        'loggedDatabase':Session.get('EDatabase'),
                        'loggedAccessData':lineItemslevel};
   Session.setPersistent('ERPSolidCurrentUSerAccess', userSerssion);

  let userModuleRedirect = lineItemsAccesslevel.sort(function (a, b) {
    if (a.description.toLowerCase() == 'NA') {
      return 1;
    }
    else if (b.description.toLowerCase() == 'NA') {
      return -1;
    }
    return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
  });







    window.open('/dashboard','_self');




}else{
      $('.loginSpinner').css('display','none');
      $('.fullScreenSpin').css('display','none');
    }
  }
var times = 0;
$("#login-button").click(function(e){


  let userLoginEmail = $("#email").val();
  let userLoginPassword = $('#erppassword').val();
  let hashUserLoginPassword = CryptoJS.MD5(userLoginPassword).toString().toUpperCase();
  var counterUserRec = null;
  let employeeUserID = '';
  let loggedUserEventFired = false;

  Session.setPersistent('ERPCurrency', '$');
  Session.setPersistent('ERPCountryAbbr', 'AUD');
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
  }else if(userLoginEmail === '') {

      swal('Invalid VS1 Email Address', 'The entered your user email address is not correct, please re-enter your email address and try again!', 'error');
      $("#email").focus();
      e.preventDefault();
  }else{
  Meteor.call('readMethodLog',userLoginEmail,hashUserLoginPassword, function(error, result){
  if(error){


    swal('Oops...', 'user-not-found, no user found please try again!', 'info');
  }else{
  let regUserDetails = result;
  if(regUserDetails){
    if(regUserDetails.length === 0){
      times++;
      if (times > 2) {
        window.open('/forgotpassword','_self');
      }else {

      }

      swal('Oops...', 'Your email or password is incorrect, please try again!', 'error');
      e.preventDefault();
    }
  for (let i = 0; i < regUserDetails.length; i++) {
    if(regUserDetails.length == 1){
        times = 0;
      var ERPIPAdderess= regUserDetails[i].server;
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

      let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
      getERPLicenceInfo(erpdbname);
      var useremail = userLoginEmail;
      var password = $("#erppassword").val();
      var hashPassword = CryptoJS.MD5(password).toString().toUpperCase();
      var cloudPassword = regUserDetails[i].password;
      if (hashPassword == cloudUserpassword){
        $('.loginSpinner').css('display','inline-block');
        $('.fullScreenSpin').css('display','inline-block');
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

        var ERPCheackUserObject = "TUser?PropertyList==ID,EmployeeId,LogonName,EmployeeName,PasswordHash,Active&Select=[LogonName]='"+ERPLoggeduserName+"'";
        var oReqCheackUserObject = new XMLHttpRequest();
        oReqCheackUserObject.open("GET",URLRequest + ERPIPAdderess + ':' + ERPport + '/' + "erpapi" + '/' + ERPCheackUserObject, true);
        oReqCheackUserObject.setRequestHeader("database",ERPdbName);
        oReqCheackUserObject.setRequestHeader("username",ERPuserName);
        oReqCheackUserObject.setRequestHeader("password",ERPpassword);
        oReqCheackUserObject.send();

        oReqCheackUserObject.onreadystatechange = function() {
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

              var ERPCheackAppUserObject = "TAppUser?PropertyList==ID,DatabaseName,UserName,MultiLogon&Select=[DatabaseName]='"+ERPdbName+"' and [UserName]='"+ERPLoggeduserName+"'";
              var oReqCheackAppUserObject = new XMLHttpRequest();
              oReqCheackAppUserObject.open("GET",URLRequest + ERPIPAdderess + ':' + ERPport + '/' + "erpapi" + '/' + ERPCheackAppUserObject, true);
              oReqCheackAppUserObject.setRequestHeader("database",ERPdbName);
              oReqCheackAppUserObject.setRequestHeader("username",ERPuserName);
              oReqCheackAppUserObject.setRequestHeader("password",ERPpassword);
              oReqCheackAppUserObject.send();


              oReqCheackAppUserObject.onreadystatechange = function() {
              if (oReqCheackAppUserObject.readyState == 4 && oReqCheackAppUserObject.status == 200) {
                var dataListCheackAppUser = JSON.parse(oReqCheackAppUserObject.responseText)
                for (var eventCheackAppUser in dataListCheackAppUser) {
                  var dataCheackAppUserCopy = dataListCheackAppUser[eventCheackAppUser];
                  if(dataCheackAppUserCopy.length === 0){
                    counterUserRec = true;
                  }else if(dataCheackAppUserCopy.length === 1){
                    if(ERPuserName.toString().toUpperCase() == ERPLoggeduserName.toString().toUpperCase()){
                      counterUserRec = true;
                    }else{
                      counterUserRec = false;
                    }

                  }else{
                    counterUserRec = false;
                  };

                  for (var dataCheackAppUser in dataCheackAppUserCopy) {
                    var mainCheackAppUserData = dataCheackAppUserCopy[dataCheackAppUser];
                    var erpUsername = mainCheackAppUserData.UserName;

                  }
              if(counterUserRec === true){

                 getSideBarData(employeeUserID,employeeUserLogon,ERPIPAdderess,erpdbname);



              document.getElementById("error_log").style.display = 'none';


              }else{

                swal('Oops...', 'VS1 User Name is already logged in. Select "Sign me out of all devices" to login', 'info');
                $('.loginSpinner').css('display','none');
                $('.fullScreenSpin').css('display','none');

              }
              }
              }

              }
              /*END APPUSER*/

            }
        }
      }else if(oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 403){
        swal({
          title: 'Oooops...',
          text: oReqCheackUserObject.getResponseHeader('errormessage'),
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
        }else if(oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 406){
          swal({
            title: 'Oooops...',
            text: oReqCheackUserObject.getResponseHeader('errormessage'),
            type: 'error',
            showCancelButton: false,
            confirmButtonText: 'Try Again'
            }).then((result) => {
            if (result.value) {
              Meteor._reload.reload();
            } else if (result.dismiss === 'cancel') {

            }
          });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
        }else if(oReqCheackUserObject.status == 0 && oReqCheackUserObject.statusText == '') {

        swal('Err Connection Refused', 'Please check setup connection!', 'error');
        setTimeout(function () {
            Meteor._reload.reload();
        }, 1500);
        }
      }
      }else{

        swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
        $("#erppassword").focus();
      }


    }else{

    }
  }
  }else{
    times++;
    if(times > 2){
      window.open('/forgotpassword','_self');
    } else {

    }

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

$("#erplogin-button").click(function(e){
  e.preventDefault();
   /* VS1 Licence Info */

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
    let isManufacturingLicence = false;
    let isWMSLicence = false;
    let isAddExtraUserLicence = false;
    let isMatrixLicence = false;
    let isShippingLicence = false;
    let isPayrollLicence = false;
    let isExpenseClaimsLicence = false;
    let isPOSLicence = false;

  let userLoginEmail = $("#email").val();
  let userLoginPassword = $("#erppassword").val();
  let hashUserLoginPassword = CryptoJS.MD5(userLoginPassword).toString().toUpperCase();
  var counterUserRec = null;
  let employeeUserID = '';
  let loggedUserEventFired = false;

  if ($('#remember_me').is(':checked')) {

      localStorage.usremail = $('#email').val();
      localStorage.usrpassword = $('#erppassword').val();
      localStorage.chkbx = $('#remember_me').val();
  }else{
      localStorage.usremail = '';
      localStorage.usrpassword = '';
      localStorage.chkbx = '';
  };

  if ($("#erppassword").val() == '') {

    swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
    $("#erppassword").focus();
    e.preventDefault();
  }else if(userLoginEmail === '') {

      swal('Please enter email address! ', '', 'warning');
      $("#email").focus();
      e.preventDefault();
  }else{

    Meteor.call('readMethod',userLoginEmail, function(error, result){
    if(error){

    }else{
    let regUserDetails = result;
    if(regUserDetails){
      if(regUserDetails.length === 0){

      }

          let cloudLoggedID = regUserDetails._id;
          let cloudLoggedDBID = regUserDetails.clouddatabaseID;
          let cloudLoggedUsername = regUserDetails.cloudUsername;


          Session.setPersistent('mycloudLogonDBID', cloudLoggedDBID);
          Session.setPersistent('mycloudLogonID', cloudLoggedID);

    }
    }

    });

    $('.loginSpinner').css('display','inline-block');
    $('.fullScreenSpin').css('display','inline-block');
    var serverTest = URLRequest + "165.228.147.127" + ':' + "4420" + '/erpapi/Vs1_Logon?Vs1UserName="'+userLoginEmail+'"&vs1Password="'+userLoginPassword+'"';

    var oReq = new XMLHttpRequest();
    oReq.open("GET",serverTest, true);
    oReq.setRequestHeader("database",'vs1_sandbox_license');
    oReq.setRequestHeader("username","VS1_Cloud_Admin");
    oReq.setRequestHeader("password","DptfGw83mFl1j&9");

    oReq.send();



    oReq.onreadystatechange = function() {

      if (oReq.readyState == 4 && oReq.status == 200) {
        $('.loginSpinner').css('display','inline-block');
        $('.fullScreenSpin').css('display','inline-block');
        Session.setPersistent('mainEIPAddress', '165.228.147.127');
        Session.setPersistent('mainEPort', '4420');
        localStorage.setItem('mainEIPAddress', licenceIPAddress);
        localStorage.setItem('mainEPort', checkSSLPorts);


        var dataReturnRes = JSON.parse(oReq.responseText);


        if(dataReturnRes.ProcessLog){
        if(dataReturnRes.ProcessLog.ResponseStatus != "OK"){
          if(dataReturnRes.ProcessLog.ResponseStatus == "Payment is Due"){
            $('.loginSpinner').css('display','none');
            $('.fullScreenSpin').css('display','none');

            swal({
              title: 'Your payment has been declined please update your payment subscription information!',
              text: '',
              type: 'error',
              showCancelButton: true,
              confirmButtonText: 'Update Payment',
              cancelButtonText: 'Cancel'
            }).then((result) => {
              if (result.value) {
                window.open('https://www.payments.vs1cloud.com/customer/account/login/referer/aHR0cHM6Ly93d3cucGF5bWVudHMudnMxY2xvdWQuY29tLw%2C%2C/', '_blank');
              } else if (result.dismiss === 'cancel') {

              }
            });

          }else{
            swal(dataReturnRes.ProcessLog.Error, dataReturnRes.ProcessLog.ResponseStatus, 'error');

            $('.loginSpinner').css('display','none');
            $('.fullScreenSpin').css('display','none');
          }
        }else{

          localStorage.setItem('vs1cloudLoginInfo', dataReturnRes);
          localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);
          if(!localStorage.getItem('VS1loggedDatabase')){
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
          }else{
            if((localStorage.getItem('VS1loggedDatabase')) == (dataReturnRes.ProcessLog.Databasename)) {
              isSameUserLogin = true;
            }else{
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


              localStorage.setItem('VS1AccoountList','');
              Session.setPersistent('bankaccountid', '');
            }
          }

          Session.setPersistent('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

          var region = dataReturnRes.ProcessLog.RegionName;
          Session.setPersistent('ERPLoggedCountry', region);
          if(dataReturnRes.ProcessLog.RegionName === "Australia"){
            Session.setPersistent('ERPCountryAbbr', 'AUD');
          }else if(dataReturnRes.ProcessLog.RegionName === "Canada"){
            Session.setPersistent('ERPCountryAbbr', 'CAD');
          }else if(dataReturnRes.ProcessLog.RegionName === "Colombia"){
            Session.setPersistent('ERPCountryAbbr', 'COP');
          }else if(dataReturnRes.ProcessLog.RegionName === "Kuwait"){
            Session.setPersistent('ERPCountryAbbr', 'KYD');
          }else if(dataReturnRes.ProcessLog.RegionName === "Mexico"){
            Session.setPersistent('ERPCountryAbbr', 'MXN');
          }else if(dataReturnRes.ProcessLog.RegionName === "New Zealand"){
            Session.setPersistent('ERPCountryAbbr', 'NZD');
          }else if(dataReturnRes.ProcessLog.RegionName === "Qatar"){
            Session.setPersistent('ERPCountryAbbr', 'QAR');
          }else if(dataReturnRes.ProcessLog.RegionName === "Kingdom of Saudi Arabia"){
            Session.setPersistent('ERPCountryAbbr', 'SAR');
          }else if(dataReturnRes.ProcessLog.RegionName === "Singapore"){
            Session.setPersistent('ERPCountryAbbr', 'SGD');
          }else if(dataReturnRes.ProcessLog.RegionName === "South Africa"){
            Session.setPersistent('ERPCountryAbbr', 'ZAR');
          }else if(dataReturnRes.ProcessLog.RegionName === "United Arab Emirates"){
            Session.setPersistent('ERPCountryAbbr', 'AED');
          }else if(dataReturnRes.ProcessLog.RegionName === "United Kingdom"){
            Session.setPersistent('ERPCountryAbbr', 'GBP');
          }else if(dataReturnRes.ProcessLog.RegionName === "United States of America"){
            Session.setPersistent('ERPCountryAbbr', 'USD');
          }
          Session.setPersistent('ERPDefaultDepartment', 'Default');
          Session.setPersistent('ERPDefaultUOM', '');
          Session.setPersistent('VS1AdminUserName', dataReturnRes.ProcessLog.VS1AdminUserName);

     var ERPIPAdderess= dataReturnRes.ProcessLog.ServerName;
     var ERPdbName = dataReturnRes.ProcessLog.Databasename;

     var ERPport = dataReturnRes.ProcessLog.APIPort;


       Session.setPersistent('mycloudLogonUserEmail', userLoginEmail);

     var ERPuserName = userLoginEmail;
      var ERPLoggeduserName = userLoginEmail;
     var ERPpassword = userLoginPassword;

     let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
    let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
    $.each(licenceOptions, function (item, option) {

              if(option.ModuleName == 'Accounts Payable Reports'){
                isAccountsLicence = true;
              }else if(option.ModuleName == 'Statements'){
                isContactsLicence = true;
              }else if((option.ModuleName == 'Expense Claims / Receipt Claiming')){
                isExpenseClaimsLicence = true;
              }else if(option.ModuleName == 'CloudDashboard'){
                isDashboardLicence = true;
              }else if(option.ModuleName == 'CloudFixedAssets'){
                isFixedAssetsLicence = true;
              }else if(option.ModuleName == 'Inventory Tracking'){
                isInventoryLicence = true;
              }else if(option.ModuleName == 'CloudMain'){
                isMainLicence = true;
              }else if(option.ModuleName == 'Manufacturing'){
                isManufacturingLicence = true;
              }else if(option.ModuleName == 'Payemnts'){
                isPaymentsLicence = true;
              }else if(option.ModuleName == 'Bills'){
                isPurchasesLicence = true;
              }else if(option.ModuleName == 'Reports Dashboard'){
                 isReportsLicence = true;
              }else if((option.ModuleName == 'Quotes') || (option.ModuleName == 'Invoices')){
                isSalesLicence = true;
              }else if(option.ModuleName == 'CloudSettings'){
                isSettingsLicence = true;
              }else if((option.ModuleName == 'Shipping')){
                isShippingLicence = true;
              }else if(option.ModuleName == 'Stock Adjustments'){
                isStockTakeLicence = true;
              }else if(option.ModuleName == 'Stock Adjustments'){
                isStockTransferLicence = true;
              }else if((option.ModuleName == 'Seed To Sale')){
                isSeedToSaleLicence = true;
              }else if(option.ModuleName == 'CloudBanking'){
                isBankingLicence = true;
              }else if((option.ModuleName == 'Payroll Integration') ){
                isPayrollLicence = true;
              }else if((option.ModuleName == 'Manufacturing')){
                isManufacturingLicence = true;
              }else if((option.ModuleName == 'POS')){
                isPOSLicence = true;
              }else if((option.ModuleName == 'WMS')){
                isWMSLicence = true;
              }else if((option.ModuleName == 'Matrix')){
                isMatrixLicence = true;
              }else if((option.ModuleName == 'Add Extra User')){
                isAddExtraUserLicence = true;
              }else if((option.ModuleName == 'FX Currency')){
                isFxCurrencyLicence = true;
              }else if((option.ModuleName == 'Use Foreign Currency')){
                isFxCurrencyLicence = true;
              }

    });

    /* Remove licence */

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
          /* End Remove licence */


          if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields){
          Session.setPersistent('vs1companyName', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_CompanyName||'');
          Session.setPersistent('vs1companyaddress1', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address||'');
          Session.setPersistent('vs1companyaddress2', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_Address2||'');
          Session.setPersistent('vs1companyABN', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_ABN||'');
          Session.setPersistent('vs1companyPhone', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_PhoneNumber||'');
          Session.setPersistent('vs1companyURL', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.Companyinfo_URL||'');

          Session.setPersistent('ERPDefaultDepartment', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultClass||'');
          Session.setPersistent('ERPDefaultUOM', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.ColumnHeadings_DefaultUOM||'');



          Session.setPersistent('ERPCountryAbbr', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_ForeignExDefault||'');
          Session.setPersistent('ERPTaxCodePurchaseInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodePurchaseInc||'');
          Session.setPersistent('ERPTaxCodeSalesInc', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.RegionalOptions_TaxCodeSalesInc||'');


          localStorage.setItem('VS1OverDueInvoiceAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_AMOUNT||Currency+'0');
          localStorage.setItem('VS1OverDueInvoiceQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OVERDUE_INVOICES_QUANTITY||0);
          localStorage.setItem('VS1OutstandingPayablesAmt_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_AMOUNT||Currency+'0');
          localStorage.setItem('VS1OutstandingPayablesQty_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.OUTSTANDING_PAYABLES_QUANTITY||0);

          localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


          localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_NetIncomeEx||0);
          localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalIncomeEx||0);
          localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalExpenseEx||0);
          localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_summary.fields.PnL_TotalCOGSEx||0);

          if(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields){
          localStorage.setItem('vs1LoggedEmployeeImages_dash', dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeePicture.fields.EncodedPic|| '');
          }else{
            localStorage.setItem('vs1LoggedEmployeeImages_dash','');
          }
          }else{
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

            localStorage.setItem('VS1MonthlyProfitandLoss_dash', '');


            localStorage.setItem('VS1ProfitandLoss_netIncomeEx_dash', '');
            localStorage.setItem('VS1ProfitandLoss_IncomeEx_dash', '');
            localStorage.setItem('VS1ProfitandLoss_ExpEx_dash', '');
            localStorage.setItem('VS1ProfitandLoss_COGSEx_dash', '');
          }

          localStorage.setItem('VS1APReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_ap_report.items)||'');
          localStorage.setItem('VS1PNLPeriodReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_pnl_period.items)||'');
          localStorage.setItem('VS1SalesListReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_saleslist.items)||'');
          localStorage.setItem('VS1SalesEmpReport_dash', JSON.stringify(dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TVS1_Dashboard_salesperemployee.items)||'');

            Session.setPersistent('LoggedUserEventFired', true);
            Session.setPersistent('userlogged_status', 'active');

                var empusername = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                var employeeUserLogon = ERPLoggeduserName;
                var employeeUserID = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeId;
                var employeename =dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.EmployeeName;
                Session.setPersistent('mySessionEmployeeLoggedID', employeeUserID);
                localStorage.setItem('mySession', employeeUserLogon);
                var sessionDataToLog = localStorage.getItem('mySession');
                Session.setPersistent('mySessionEmployee', employeename);
                let userAccessOptions = dataReturnRes.ProcessLog.ClientDetails.ProcessLog.TUser.TEmployeeFormAccessDetail || '';
                if(userAccessOptions != ""){

                    getAccessLevelData(userAccessOptions,isSameUserLogin);

                }

        }
      }

      } else if(oReq.statusText == '') {
        swal({
          title: 'Oooops...',
          text: "Connection Failed, Please try again",
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }else if(oReq.readyState == 4 && oReq.status == 403){
        swal({
          title: 'Oooops...',
          text: oReq.getResponseHeader('errormessage'),
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }else if(oReq.readyState == 4 && oReq.status == 406){
        swal({
          title: 'Oooops...',
          text: oReq.getResponseHeader('errormessage'),
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }else if(oReq.readyState == 4 && oReq.status == 500){
        swal({
          title: 'Oooops...',
          text: oReq.getResponseHeader('errormessage'),
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }else{













        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }
  }

}

e.preventDefault();
});
$("#erplogin-buttonSimon").click(function(e){
  e.preventDefault();
   /* VS1 Licence Info */

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
    let isManufacturingLicence = false;
    let isWMSLicence = false;
    let isAddExtraUserLicence = false;
    let isMatrixLicence = false;
    let isShippingLicence = false;
    let isPayrollLicence = false;
    let isExpenseClaimsLicence = false;
    let isPOSLicence = false;
    /*End Option to Add */

  let userLoginEmail = $("#email").val();
  let userLoginPassword = $("#erppassword").val();
  let hashUserLoginPassword = CryptoJS.MD5(userLoginPassword).toString().toUpperCase();
  var counterUserRec = null;
  let employeeUserID = '';
  let loggedUserEventFired = false;





  if ($('#remember_me').is(':checked')) {

      localStorage.usremail = $('#email').val();
      localStorage.usrpassword = $('#erppassword').val();
      localStorage.chkbx = $('#remember_me').val();
  }else{
      localStorage.usremail = '';
      localStorage.usrpassword = '';
      localStorage.chkbx = '';
  };

  if ($("#erppassword").val() == '') {

    swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
    $("#erppassword").focus();
    e.preventDefault();
  }else if(userLoginEmail === '') {

      swal('Please enter email address! ', '', 'warning');
      $("#email").focus();
      e.preventDefault();
  }else{

    Meteor.call('readMethod',userLoginEmail, function(error, result){
    if(error){

    }else{
    let regUserDetails = result;
    if(regUserDetails){
      if(regUserDetails.length === 0){

      }

          let cloudLoggedID = regUserDetails._id;
          let cloudLoggedDBID = regUserDetails.clouddatabaseID;
          let cloudLoggedUsername = regUserDetails.cloudUsername;


          Session.setPersistent('mycloudLogonDBID', cloudLoggedDBID);
          Session.setPersistent('mycloudLogonID', cloudLoggedID);

    }
    }

    });

    $('.loginSpinner').css('display','inline-block');
    $('.fullScreenSpin').css('display','inline-block');
    var serverTest = URLRequest + "165.228.147.127" + ':' + "4420" + '/erpapi/Vs1_Logon?Vs1UserName="'+userLoginEmail+'"&vs1Password="'+userLoginPassword+'"';

    var oReq = new XMLHttpRequest();
    oReq.open("GET",serverTest, true);
    oReq.setRequestHeader("database",'vs1_sandbox_license');
    oReq.setRequestHeader("username","VS1_Cloud_Admin");
    oReq.setRequestHeader("password","DptfGw83mFl1j&9");

    oReq.send();



    oReq.onreadystatechange = function() {

      if (oReq.readyState == 4 && oReq.status == 200) {
        $('.loginSpinner').css('display','inline-block');
        $('.fullScreenSpin').css('display','inline-block');
        Session.setPersistent('mainEIPAddress', '165.228.147.127');
        Session.setPersistent('mainEPort', '4420');

        localStorage.setItem('mainEIPAddress', licenceIPAddress);
        localStorage.setItem('mainEPort', checkSSLPorts);


        var dataReturnRes = JSON.parse(oReq.responseText);


        if(dataReturnRes.ProcessLog.Error){

          swal(dataReturnRes.ProcessLog.Error, '', 'error');
          $('.loginSpinner').css('display','none');
          $('.fullScreenSpin').css('display','none');
        }else{

          localStorage.setItem('vs1cloudlicenselevel', dataReturnRes.ProcessLog.LicenseLevel);

          Session.setPersistent('ERPCurrency', dataReturnRes.ProcessLog.TRegionalOptions.CurrencySymbol);

          var region = dataReturnRes.ProcessLog.RegionName;
          Session.setPersistent('ERPLoggedCountry', region);

          Session.setPersistent('ERPCountryAbbr', 'AUD');
          Session.setPersistent('ERPDefaultDepartment', 'Default');
          Session.setPersistent('ERPDefaultUOM', '');

     var ERPIPAdderess= dataReturnRes.ProcessLog.ServerName;
     var ERPdbName = dataReturnRes.ProcessLog.Databasename;

     var ERPport = dataReturnRes.ProcessLog.APIPort;


       Session.setPersistent('mycloudLogonUserEmail', userLoginEmail);

     var ERPuserName = userLoginEmail;
      var ERPLoggeduserName = userLoginEmail;
     var ERPpassword = userLoginPassword;

     let erpdbname = ERPIPAdderess+','+ERPdbName+','+ERPuserName+','+ERPpassword+','+ERPport;
    let licenceOptions = dataReturnRes.ProcessLog.Modules.Modules;
   $.each(licenceOptions, function (item, option) {

              if(option.ModuleName == 'CloudAccounts'){
                isAccountsLicence = true;
              }else if(option.ModuleName == 'CloudContacts'){
                isContactsLicence = true;
              }else if(option.ModuleName == 'CloudExpenseClaims'){
                isExpenseClaimsLicence = true;
              }else if(option.ModuleName == 'CloudDashboard'){
                isDashboardLicence = true;
              }else if(option.ModuleName == 'CloudFixedAssets'){
                isFixedAssetsLicence = true;
              }else if(option.ModuleName == 'CloudInventory'){
                isInventoryLicence = true;
              }else if(option.ModuleName == 'CloudMain'){
                isMainLicence = true;
              }else if(option.ModuleName == 'CloudManufacturing'){
                isManufacturingLicence = true;
              }else if(option.ModuleName == 'CloudPayments'){
                isPaymentsLicence = true;
              }else if(option.ModuleName == 'CloudPurchases'){
                isPurchasesLicence = true;
              }else if(option.ModuleName == 'CloudReports'){
                 isReportsLicence = true;
              }else if(option.ModuleName == 'CloudSales'){
                isSalesLicence = true;
              }else if(option.ModuleName == 'CloudSettings'){
                isSettingsLicence = true;
              }else if(option.ModuleName == 'CloudShipping'){
                isShippingLicence = true;
              }else if(option.ModuleName == 'CloudStockTake'){
                isStockTakeLicence = true;
              }else if(option.ModuleName == 'CloudStockTransfer'){
                isStockTransferLicence = true;
              }

    });

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

          if(dataReturnRes.ProcessLog.AccessLevels == undefined){
            swal('Sorry, You do not have access to any VS1 Modules!', '', 'error');
            $('.fullScreenSpin').css('display','none');
            $('.loginSpinner').css('display','none');
            return false;

          };
          let userAccessOptions = dataReturnRes.ProcessLog.AccessLevels.AccessLevels;




  Session.setPersistent('mycloudLogonUsername', ERPuserName);
  Session.setPersistent('mycloudLogonUserEmail', ERPuserName);

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

var ERPCheackUserObject = "TUser?PropertyList==ID,EmployeeId,LogonName,EmployeeName,PasswordHash,Active&Select=[LogonName]='"+ERPuserName+"'";
var oReqCheackUserObject = new XMLHttpRequest();
oReqCheackUserObject.open("GET",URLRequest + ERPIPAdderess + ':' + ERPport + '/' + "erpapi" + '/' + ERPCheackUserObject, true);
oReqCheackUserObject.setRequestHeader("database",ERPdbName);
oReqCheackUserObject.setRequestHeader("username",ERPuserName);
oReqCheackUserObject.setRequestHeader("password",ERPpassword);
oReqCheackUserObject.send();

oReqCheackUserObject.onreadystatechange = function() {
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
      localStorage.setItem('mySession', employeeUserLogon);
      var sessionDataToLog = localStorage.getItem('mySession');
      Session.setPersistent('mySessionEmployee', employeename);

      var ERPCheackAppUserObject = "TAppUser?PropertyList==ID,DatabaseName,UserName,MultiLogon&Select=[DatabaseName]='"+ERPdbName+"' and [UserName]='"+ERPLoggeduserName+"'";
      var oReqCheackAppUserObject = new XMLHttpRequest();
      oReqCheackAppUserObject.open("GET",URLRequest + ERPIPAdderess + ':' + ERPport + '/' + "erpapi" + '/' + ERPCheackAppUserObject, true);
      oReqCheackAppUserObject.setRequestHeader("database",ERPdbName);
      oReqCheackAppUserObject.setRequestHeader("username",ERPuserName);
      oReqCheackAppUserObject.setRequestHeader("password",ERPpassword);
      oReqCheackAppUserObject.send();


      oReqCheackAppUserObject.onreadystatechange = function() {
      if (oReqCheackAppUserObject.readyState == 4 && oReqCheackAppUserObject.status == 200) {
        var dataListCheackAppUser = JSON.parse(oReqCheackAppUserObject.responseText)
        for (var eventCheackAppUser in dataListCheackAppUser) {
          var dataCheackAppUserCopy = dataListCheackAppUser[eventCheackAppUser];
          if(dataCheackAppUserCopy.length === 0){
            counterUserRec = true;
          }else if(dataCheackAppUserCopy.length === 1){
            if(ERPuserName.toString().toUpperCase() == ERPLoggeduserName.toString().toUpperCase()){
              counterUserRec = true;
            }else{
              counterUserRec = false;
            }

          }else{
            counterUserRec = false;
          };

          for (var dataCheackAppUser in dataCheackAppUserCopy) {
            var mainCheackAppUserData = dataCheackAppUserCopy[dataCheackAppUser];
            var erpUsername = mainCheackAppUserData.UserName;

          }
      if(counterUserRec === true){


         if(userAccessOptions != ""){
           getAccessLevelData(userAccessOptions);
         }







      }else{

          swal('Oops...', 'VS1 User Name is already logged in. Select "Sign me out of all devices" to login', 'info');
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');

      }
      }
      }

      }
      /*END APPUSER*/

    }
}
}else if(oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 403){

  swal({
    title: 'Oooops...',
    text: oReqCheackUserObject.getResponseHeader('errormessage'),
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Try Again'
    }).then((result) => {
    if (result.value) {
      Meteor._reload.reload();
    } else if (result.dismiss === 'cancel') {

    }
  });
$('.loginSpinner').css('display','none');
$('.fullScreenSpin').css('display','none');
}else if(oReqCheackUserObject.readyState == 4 && oReqCheackUserObject.status == 406){
  swal({
    title: 'Oooops...',
    text: oReqCheackUserObject.getResponseHeader('errormessage'),
    type: 'error',
    showCancelButton: false,
    confirmButtonText: 'Try Again'
    }).then((result) => {
    if (result.value) {
      Meteor._reload.reload();
    } else if (result.dismiss === 'cancel') {
      $('.loginSpinner').css('display','none');
      $('.fullScreenSpin').css('display','none');
    }
  });
$('.loginSpinner').css('display','none');
$('.fullScreenSpin').css('display','none');
}else if(oReqCheackUserObject.status == 0 && oReqCheackUserObject.statusText == '') {
swal('Err Connection Refused', 'Please check setup connection!', 'error');
setTimeout(function () {
    Meteor._reload.reload();
}, 1500);
}
}








   }

      } else if(oReq.statusText == '') {
        swal({
          title: 'Oooops...',
          text: "Connection Failed, Please try again",
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }else if(oReq.readyState == 4 && oReq.status == 403){
        swal({
          title: 'Oooops...',
          text: oReq.getResponseHeader('errormessage'),
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }else if(oReq.readyState == 4 && oReq.status == 406){
        swal({
          title: 'Oooops...',
          text: oReq.getResponseHeader('errormessage'),
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }else if(oReq.readyState == 4 && oReq.status == 500){
        swal({
          title: 'Oooops...',
          text: oReq.getResponseHeader('errormessage'),
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
            Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
        });
        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }else{













        $('.loginSpinner').css('display','none');
        $('.fullScreenSpin').css('display','none');
      }
  }

}

e.preventDefault();
});
$("#erppassword").keyup(function (e) {
  if (e.keyCode == 13) {
     $("#erplogin-button").trigger("click");
  }
});

$("#signmeout").click(function(e){
   e.preventDefault();
   $('.fullScreenSpin').css('display','inline-block');
   let userLoginEmail = $("#email").val();
   let userLoginPassword = $("#erppassword").val();
   let hashUserLoginPassword = CryptoJS.MD5(userLoginPassword).toString().toUpperCase();
   if ($("#erppassword").val() == '') {

   swal('Please enter your user password!', '', 'warning');
   $('.fullScreenSpin').css('display','none');
   $("#erppassword").focus();
   e.preventDefault();
   }else if(userLoginEmail === '') {

       swal('Please enter email address!', '', 'warning');
       $('.fullScreenSpin').css('display','none');
       $("#email").focus();
       e.preventDefault();
   }else{
     $('.fullScreenSpin').css('display','none');

   }
});

$(".toggle-password").click(function() {
    $(this).toggleClass("fa-eye fa-eye-slash");
    var passwordSecret = $("#erppassword");

    if (passwordSecret.attr("type") == "password") {
        passwordSecret.attr("type", "text");
    } else {
        passwordSecret.attr("type", "password");
    }
});

});
