import {AccountService} from "../accounts/account-service";
import {ReactiveVar} from "meteor/reactive-var";
import {UtilityService} from "../utility-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import { Random } from 'meteor/random';

import 'jquery-editable-select';
let utilityService = new UtilityService();

Template.reconciliation.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.records = new ReactiveVar();
  templateObject.record = new ReactiveVar({});
  templateObject.accountnamerecords = new ReactiveVar();

});

Template.reconciliation.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    let templateObject = Template.instance();
    let accountService = new AccountService();

    $("#date-input,#dtDate").datepicker({
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
      const accountnamerecords = [];
    templateObject.getAccountNames = function(){
      accountService.getAccountName().then(function(data){
        for(let i in data.taccount){

          let accountnamerecordObj = {
            accountname: data.taccount[i].AccountName || ' '
          };
          accountnamerecords.push(accountnamerecordObj);
          templateObject.accountnamerecords.set(accountnamerecords);

        }
    });

    }
    templateObject.getAccountNames();
});

Template.reconciliation.helpers({
  accountnamerecords: () => {
      return Template.instance().accountnamerecords.get().sort(function(a, b){
        if (a.accountname == 'NA') {
      return 1;
          }
      else if (b.accountname == 'NA') {
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
    }
});
