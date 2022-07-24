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
Template.newshipvia.onCreated(() => {});
Template.newshipvia.onRendered(() => {});
Template.newshipvia.helpers({});
Template.newshipvia.events({
    'click .btnSaveShipVia': function() {
        $('.fullScreenSpin').css('display', 'inline-block');
        let clientService = new SalesBoardService()
        let shipViaData = $('#edtShipVia').val() || '';
        let shipViaID = $('#edtShipViaID').val() || 0;
        let leadData = '';
        if (shipViaID == "") {
            leadData = {
                type: 'TShippingMethod',
                fields: {
                    ShippingMethod: shipViaData
                }
            };
        } else {
            leadData = {
                type: 'TShippingMethod',
                fields: {
                    ID: parseInt(shipViaID),
                    ShippingMethod: shipViaData
                }
            };
        }

        if (shipViaData != "") {
            clientService.saveShipVia(leadData).then(function(objDetails) {
                sideBarService.getShippingMethodData().then(function(dataUpdate) {
                    $('#shipvia').val(shipViaData);
                    $('#newShipViaModal').modal('toggle');
                    $('.fullScreenSpin').css('display', 'none');
                    addVS1Data('TShippingMethod', JSON.stringify(dataUpdate)).then(function(datareturn) {
                        $('.fullScreenSpin').css('display', 'none');
                    }).catch(function(err) {});
                }).catch(function(err) {
                    $('#newShipViaModal').modal('toggle');
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
                title: 'Please Enter Ship Via Method',
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
