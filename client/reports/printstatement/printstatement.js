import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {DashBoardService} from "../../Dashboard/dashboard-service";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';

Template.printstatement.onCreated(()=>{

});

Template.printstatement.onRendered(()=>{
  let templateObject = Template.instance();
  let salesOrderTable;
  var splashArray = new Array();

    $("#date-input,#dtSODate,#printfromdate, #printtodate").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        dateFormat: 'dd/mm/yy',
        // dateFormat: 'yy-mm-dd',
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

  });
