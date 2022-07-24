import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {STSService} from "../sts-service";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import XLSX from 'xlsx';
let utilityService = new UtilityService();

Template.stscreateharvests.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.roomrecords = new ReactiveVar([]);
});


Template.stscreateharvests.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    $('.fullScreenSpin').css('display','none');

    let templateObject = Template.instance();
    let stsService = new STSService();

    // BEGIN LOAD ROOMS
    templateObject.getRooms = function () {

        stsService.getBins().then(function (data) {
            let binList = [];
            for (let i = 0; i < data.tproductbin.length; i++) {

                let dataObj = {
                    roomid: data.tproductbin[i].BinNumber || ' ',
                    roomname: data.tproductbin[i].BinLocation || ' '
                };
                if(data.tproductbin[i].BinLocation.replace(/\s/g, '') != ''){
                    binList.push(dataObj);
                }

            }
            templateObject.roomrecords.set(binList);
        });
    };
    templateObject.getRooms();
    // END LOAD ROOMS

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


Template.stscreateharvests.events({
});


Template.stscreateharvests.helpers({
    listDept: () => {
        return Template.instance().departlist.get().sort(function(a, b){
            if (a.deptname == 'NA') {
                return 1;
            }
            else if (b.deptname == 'NA') {
                return -1;
            }
            return (a.deptname.toUpperCase() > b.deptname.toUpperCase()) ? 1 : -1;
        });
    },
    listBins: () => {
        return Template.instance().roomrecords.get().sort(function(a, b){
            if (a.roomname == 'NA') {
                return 1;
            }
            else if (b.roomname == 'NA') {
                return -1;
            }
            return (a.roomname.toUpperCase() > b.roomname.toUpperCase()) ? 1 : -1;
        });
    }
});
