import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {STSService} from "../sts-service";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import XLSX from 'xlsx';
let utilityService = new UtilityService();
const templateObject = Template.instance();

Template.stsoverviews.onCreated(function(){

});


Template.stsoverviews.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    $('.fullScreenSpin').css('display','none');
    const templateObject = Template.instance();
    const dataTableList = [];
    const tableHeaderList = [];

    // For storing table headers
    Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'tblPlants', function(error, result){
        if(error){

        }else{
            if(result){
                
                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th."+columnClass+"").html(columData);
                    $("th."+columnClass+"").css('width',""+columnWidth+"px");

                }
            }

        }
    });
});


Template.stsoverviews.events({
    'click #btnTagOrderList':function(event){
        window.open('/ststagorderlist','_self');
    },
    'click #btnHarvestList':function(event){
        window.open('/stsharvestlist','_self');
    },
    'click #btnPackageList':function(event){
        window.open('/stspackagelist','_self');
    },
    'click #btnTagHistory':function(event){
        window.open('/ststaghistory','_self');
    },
    'click #btnActivityLog':function(event){
        window.open('/stsactivitylog','_self');
    },
    'click #btnActiveInventory':function(event){
        window.open('/stsactiveinventory','_self');
    },
    'click #btnTransferHistory':function(event){
        window.open('/ststransferhistory','_self');
    },
    'click #btnLocationOverview':function(event){
        window.open('/stslocationoverview','_self');
    },
});


Template.stsoverviews.helpers({
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.strainname == 'NA') {
                return 1;
            }
            else if (b.strainname == 'NA') {
                return -1;
            }
            return (a.strainname.toUpperCase() > b.strainname.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    }

});
