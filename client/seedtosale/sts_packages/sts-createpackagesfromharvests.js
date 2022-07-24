import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {STSService} from "../sts-service";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import XLSX from 'xlsx';
let utilityService = new UtilityService();

Template.stscreatepackagesfromharvest.onCreated(function(){

});


Template.stscreatepackagesfromharvest.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    $('.fullScreenSpin').css('display','none');

    // BEGIN DATE CODE
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
    });

    var currentDate = new Date();
    var begunDate = moment(currentDate).format("DD/MM/YYYY");

    $('.formClassDate').val(begunDate);
    // END DATE CODE
});


Template.stscreatepackagesfromharvest.events({
});


Template.stscreatepackagesfromharvest.helpers({

});