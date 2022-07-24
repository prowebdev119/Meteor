import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../../js/core-service';
import {STSService} from "../sts-service";
import {UtilityService} from "../../utility-service";
import '../../lib/global/erp-objects';
import XLSX from 'xlsx';
let utilityService = new UtilityService();

Template.stsrecordadditives.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.departlist = new ReactiveVar([]);
});


Template.stsrecordadditives.onRendered(function() {
    $('.fullScreenSpin').css('display','inline-block');
    $('.fullScreenSpin').css('display','none');

    let templateObject = Template.instance();
    let stsService = new STSService();

    // BEGIN GETTING DEPARTMENT
    templateObject.getDeptList = function () {

        stsService.getDepartment().then(function (data) {
            let deptList = [];
            for (let i = 0; i < data.tdeptclass.length; i++) {

                let dataObject = {
                    departid: data.tdeptclass[i].Id || ' ',
                    deptname: data.tdeptclass[i].DeptClassName || ' ',
                };
                
                if(data.tdeptclass[i].DeptClassName.replace(/\s/g, '') != ''){
                    deptList.push(dataObject);
                }

            }
            templateObject.departlist.set(deptList);
        });
    };
    templateObject.getDeptList();
    // END GETTING DEPARTMENT

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


Template.stsrecordadditives.events({
});


Template.stsrecordadditives.helpers({
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
    }
});
