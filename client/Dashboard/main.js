import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {DashBoardService} from './dashboard-service';

Template.home.onCreated(function () {
    this.loggedDb = new ReactiveVar("");
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

    // NEW FROM IAN 22102019
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
});

Template.home.onRendered(function () {
  const templateObject = Template.instance();

  let isDashboard = Session.get('CloudDashboardModule');
  console.log(isDashboard);
  let isMain = Session.get('CloudMainModule');
  let isInventory = Session.get('CloudInventoryModule');
  let isManufacturing = Session.get('CloudManufacturingModule');
  let isAccessLevels = Session.get('CloudAccessLevelsModule');
  let isShipping = Session.get('CloudShippingModule');
  let isStockTransfer = Session.get('CloudStockTransferModule');
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
  var erpGet = erpDb();
  var LoggedDB = erpGet.ERPDatabase;
  var LoggedUser = localStorage.getItem('mySession');

  if(LoggedDB !== null){
    if(isDashboard){
      templateObject.includeDashboard.set(true);
    }
    if(isMain){
      templateObject.includeMain.set(true);
    }
    if(isInventory){
      templateObject.includeInventory.set(true);
    }
    if(isManufacturing){
      templateObject.includeManufacturing.set(true);
    }
    if(isAccessLevels){
      templateObject.includeAccessLevels.set(true);
    }
    if(isShipping){
      templateObject.includeShipping.set(true);
    }
    if(isStockTransfer){
      templateObject.includeStockTransfer.set(true);
    }
    if(isStockTake){
      templateObject.includeStockTake.set(true);
    }
    if(isSales){
      templateObject.includeSales.set(true);
    }
    if(isPurchases){
      templateObject.includePurchases.set(true);
    }

    if(isExpenseClaims){
      templateObject.includeExpenseClaims.set(true);
    }

    if(isFixedAssets){
      templateObject.includeFixedAssets.set(true);
    }

    if(isPayments){
      templateObject.includePayments.set(true);
    }

    if(isContacts){
      templateObject.includeContacts.set(true);
    }

    if(isAccounts){
      templateObject.includeAccounts.set(true);
    }

    if(isReports){
      templateObject.includeReports.set(true);
    }

    if(isSettings){
      templateObject.includeSettings.set(true);
    }
  }
    //get logged in db
    this.loggedDb.set(CoreService.getCurrentDatabase());
    let dashBoardService = new DashBoardService();
    //demo for get one object
    // dashBoardService.getOneInvoice(4).then((data)=>{
    // });

    var DashBankBalance = '<a class="noredirectLink">' + Currency + '0.00</a>';
    document.getElementById("dashbalance").innerHTML = DashBankBalance;

    var DashStatementBalance = '<a class="noredirectLink" >' + Currency + '0.00</a>';
    document.getElementById("dashstatement_balance").innerHTML = DashStatementBalance;

    var DashBSAStatementBalance = '<a class="noredirectLink">' + Currency + '0.00</a>';
    document.getElementById("dash_bsa_statement").innerHTML = DashBSAStatementBalance;
});


Template.home.helpers({
    loggedDb: function() {
        return Template.instance().loggedDb.get();
    },
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
    includeStockTake: () => {
        return Template.instance().includeStockTake.get();
    },
    includeSales: () => {
        return Template.instance().includeSales.get();
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
    }
});

// Listen to event to update reactive variable
Template.home.events({
  'click .includeAccessLevels': function (event) {
    FlowRouter.go('/accesslevel');
  },
  'click .includeAccounts': function (event) {
    FlowRouter.go('/bankaccounts');
  },
  'click .includeContacts': function (event) {
    FlowRouter.go('/allcontacts');
  },
  'click .includeDashboard': function (event) {
    FlowRouter.go('/dashboard');
  },
  'click .includeExpenseClaims': function (event) {
    FlowRouter.go('/expenseclaims/current-claims');
  },
  'click .includeFixedAssets': function (event) {
    FlowRouter.go('/fixedassets/draft');
  },
  'click .includeInventory': function (event) {
    FlowRouter.go('/productexpresslist');
  },
  'click .includeMain': function (event) {
    FlowRouter.go('/home');
  },
  'click .includeManufacturing': function (event) {
    FlowRouter.go('/manufacturing');
  },
  'click .includePayments': function (event) {
    FlowRouter.go('/customerpaymentlist');
  },
  'click .includePurchases': function (event) {
    FlowRouter.go('/purchases');
  },
  'click .includeReports': function (event) {
    FlowRouter.go('/allreports');
  },
  'click .includeSales': function (event) {
    FlowRouter.go('/allsales');
  },
  'click .includeSettings': function (event) {
    FlowRouter.go('/settings');
  },
  'click .includeShipping': function (event) {
    FlowRouter.go('/shipping');
  },
  'click .includeStockTake': function (event) {
    FlowRouter.go('/stocktake');
  },
  'click .includeStockTransfer': function (event) {
    FlowRouter.go('/stocktransfer');
  },
  'click .includeLogOut': function (event) {
    FlowRouter.go('/');
    CloudUser.update({_id: Session.get('mycloudLogonID')},{ $set: {userMultiLogon: false}});
  },
  'mouseenter .portfolio .includeLogOut': function (event) {
    $('.includeLogOut').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeLogOut': function (event) {
    $('.includeLogOut').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  },
  'mouseenter .portfolio .includeAccessLevels': function (event) {
    $('.includeAccessLevels').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeAccessLevels': function (event) {
    $('.includeAccessLevels').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  },
  'mouseenter .portfolio .includeAccounts': function (event) {
    $('.includeAccounts').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeAccounts': function (event) {
    $('.includeAccounts').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  },
  'mouseenter .portfolio .includeContacts': function (event) {
    $('.includeContacts').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeContacts': function (event) {
    $('.includeContacts').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  },
  'mouseenter .portfolio .includeDashboard': function (event) {
    $('.includeDashboard').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeDashboard': function (event) {
    $('.includeDashboard').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  },
  'mouseenter .portfolio .includeExpenseClaims': function (event) {
    $('.includeExpenseClaims').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeExpenseClaims': function (event) {
    $('.includeExpenseClaims').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  },

  'mouseenter .portfolio .includeFixedAssets': function (event) {
    $('.includeFixedAssets').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeFixedAssets': function (event) {
    $('.includeFixedAssets').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  },
  'mouseenter .portfolio .includeInventory': function (event) {
    $('.includeInventory').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeInventory': function (event) {
    $('.includeInventory').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  },
  'mouseenter .portfolio .includeMain': function (event) {
    $('.includeMain').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeMain': function (event) {
    $('.includeMain').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }

  //
  ,
  'mouseenter .portfolio .includeManufacturing': function (event) {
    $('.includeManufacturing').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeManufacturing': function (event) {
    $('.includeManufacturing').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }
  ,
  'mouseenter .portfolio .includePayments': function (event) {
    $('.includePayments').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includePayments': function (event) {
    $('.includePayments').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }
  ,
  'mouseenter .portfolio .includePurchases': function (event) {
    $('.includePurchases').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includePurchases': function (event) {
    $('.includePurchases').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }
  ,
  'mouseenter .portfolio .includeReports': function (event) {
    $('.includeReports').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeReports': function (event) {
    $('.includeReports').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }
  ,
  'mouseenter .portfolio .includeSales': function (event) {
    $('.includeSales').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeSales': function (event) {
    $('.includeSales').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }
  ,
  'mouseenter .portfolio .includeSettings': function (event) {
    $('.includeSettings').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeSettings': function (event) {
    $('.includeSettings').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }
  ,
  'mouseenter .portfolio .includeShipping': function (event) {
    $('.includeShipping').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeShipping': function (event) {
    $('.includeShipping').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }
  ,
  'mouseenter .portfolio .includeStockTake': function (event) {
    $('.includeStockTake').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeStockTake': function (event) {
    $('.includeStockTake').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }
  ,
  'mouseenter .portfolio .includeStockTransfer': function (event) {
    $('.includeStockTransfer').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(0, 177, 230))"
      });
  },
  'mouseleave .portfolio .includeStockTransfer': function (event) {
    $('.includeStockTransfer').css({
    "background-image": "linear-gradient(rgb(0, 177, 230), rgb(4, 138, 187))"
      });
  }


});
