import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {STSService} from "../sts-service";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import XLSX from 'xlsx';
let utilityService = new UtilityService();
const templateObject = Template.instance();

Template.stsharvests.onCreated(function(){

});

Template.stsharvests.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    $('.fullScreenSpin').css('display','none');
});

Template.stsharvests.events({
    'click #btnCreateHarvest':function(event){
        window.open('/stscreateharvests','_self');
    }
});

Template.stsharvests.helpers({

});