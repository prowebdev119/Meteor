import {
    SalesBoardService
} from '../js/sales-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    CoreService
} from '../js/core-service';
import {
    UtilityService
} from "../utility-service";
import '../lib/global/erp-objects';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import {
    SideBarService
} from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
var times = 0;
Template.newstatuspop.onCreated(() => {});
Template.newstatuspop.onRendered(() => {});
Template.newstatuspop.helpers({});
Template.newstatuspop.events({
    'click .btnSaveStatus': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let clientService = new SalesBoardService()
        let status = $('#newStatus').val();
        let statusid = $('#statusId').val();
        let leadData = '';
        if (statusid == "") {
            leadData = {
                type: 'TLeadStatusType',
                fields: {
                    TypeName: status,
                    KeyValue: status
                }
            };
        } else {
            leadData = {
                type: 'TLeadStatusType',
                fields: {
                    ID: parseInt(statusid),
                    TypeName: status,
                    KeyValue: status
                }
            };
        }

        if (status != "") {
            clientService.saveLeadStatus(leadData).then(function(objDetails) {
                sideBarService.getAllLeadStatus().then(function(dataUpdate) {
                    $('#sltStatus').val(status);
                    $('#newStatusPopModal').modal('toggle');
                    $('.fullScreenSpin').css('display', 'none');
                    addVS1Data('TLeadStatusType', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        $('.fullScreenSpin').css('display', 'none');
                    }).catch(function(err) {});
                }).catch(function(err) {
                    $('#newStatusPopModal').modal('toggle');
                    $('.fullScreenSpin').css('display', 'none');
                });
            }).catch(function(err) {
                $('.fullScreenSpin').css('display', 'none');
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {if(err === checkResponseError){window.open('/', '_self');}}
                    else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            $('.fullScreenSpin').css('display', 'none');
            swal({
                title: 'Please Enter Status',
                text: "Status field cannot be empty",
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {}
                else if (result.dismiss === 'cancel') {}
            });
        }
    }
});
