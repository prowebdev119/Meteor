import { ContactService } from "../../contacts/contact-service";
import { SideBarService } from '../../js/sidebar-service';
import {TaxRateService} from "../settings-service";
import { ReactiveVar } from 'meteor/reactive-var';

let sideBarService = new SideBarService();
Template.clienttypemodal.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.deptrecords = new ReactiveVar();
    templateObject.roomrecords = new ReactiveVar([]);
    templateObject.clienttypeList = new ReactiveVar();

    templateObject.departlist = new ReactiveVar([]);
});

Template.clienttypemodal.onRendered(function () {

});

Template.clienttypemodal.events({
    'click .btnCloseAddNewDept': function () {
        $('#newTaxRate').css('display', 'none');

    },
    'click .btnSaveClientType': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        var url = FlowRouter.current().path;
        let contactService = new ContactService();
        let objDetails ={};
        //let headerDept = $('#sltDepartment').val();
        let custType = $('#edtClientTypeName').val() || '';
        let typeDesc = $('#txaDescription').val() || '';
        let id = $('#typeID').val() || '';
        if (custType === '') {
            swal('Client Type name cannot be blank!', '', 'warning');
            $('.fullScreenSpin').css('display', 'none');
            e.preventDefault();
        } else {
            if(id == "") {
            objDetails = {
                type: "TClientType",
                fields: {
                    TypeName: custType,
                    TypeDescription: typeDesc,
                    Active: true
                }
            }
        } else {
                objDetails = {
                type: "TClientType",
                fields: {
                    Id: id,
                    TypeName: custType,
                    TypeDescription: typeDesc,
                    Active: true
                }

            }
            }
            objDetails = {
                type: "TClientType",
                fields: {
                    TypeName: custType,
                    TypeDescription: typeDesc,
                    Active: true
                }
            }
            contactService.saveClientTypeData(objDetails).then(function (objDetails) {
                sideBarService.getClientTypeData().then(function (dataReload) {
                    addVS1Data('TClientType', JSON.stringify(dataReload)).then(function (datareturn) {
                        if(url.includes("/productview")) {
                            $('#sltCustomerType').val(custType); 
                            $('#myModalClientType').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                            return false;
                         }
                        Meteor._reload.reload();
                    }).catch(function (err) {
                         if(url.includes("/productview")) {
                            $('#sltCustomerType').val(custType); 
                            $('#myModalClientType').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                            return false;
                         }
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
                     if(url.includes("/productview")) {
                            $('#sltCustomerType').val(custType); 
                            $('#myModalClientType').modal('toggle');
                            $('.fullScreenSpin').css('display', 'none');
                            return false;
                         }
                    Meteor._reload.reload();
                });
                // Meteor._reload.reload();
            }).catch(function (err) {

                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                        // Meteor._reload.reload();
                    } else if (result.dismiss === 'cancel') {}
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        }
    },

    'click .btnBack': function (event) {
        event.preventDefault();
        history.back(1);
    },
    'keydown #edtSiteCode, keyup #edtSiteCode': function (event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {}

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190) {
            event.preventDefault();
        } else {
            //event.preventDefault();
        }

    },
    'blur #edtSiteCode': function (event) {
        $(event.target).val($(event.target).val().toUpperCase());

    }
});

Template.clienttypemodal.helpers({
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.typeName == 'NA') {
                return 1;
            } else if (b.typeName == 'NA') {
                return -1;
            }
            return (a.typeName.toUpperCase() > b.typeName.toUpperCase()) ? 1 : -1;
            // return (a.saledate.toUpperCase() < b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({
            userid: Session.get('mycloudLogonID'),
            PrefName: 'clienttypeList'
        });
    },
    deptrecords: () => {
        return Template.instance().deptrecords.get().sort(function (a, b) {
            if (a.department == 'NA') {
                return 1;
            } else if (b.department == 'NA') {
                return -1;
            }
            return (a.department.toUpperCase() > b.department.toUpperCase()) ? 1 : -1;
        });
    },
    isModuleGreenTrack: () => {
        return isModuleGreenTrack;
    },
    listEmployees: () => {
        return Template.instance().employeerecords.get().sort(function (a, b) {
            if (a.employeename == 'NA') {
                return 1;
            } else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    listBins: () => {
        return Template.instance().roomrecords.get().sort(function (a, b) {
            if (a.roomname == 'NA') {
                return 1;
            } else if (b.roomname == 'NA') {
                return -1;
            }
            return (a.roomname.toUpperCase() > b.roomname.toUpperCase()) ? 1 : -1;
        });
    },
    listDept: () => {
        return Template.instance().departlist.get().sort(function (a, b) {
            if (a.deptname == 'NA') {
                return 1;
            } else if (b.deptname == 'NA') {
                return -1;
            }
            return (a.deptname.toUpperCase() > b.deptname.toUpperCase()) ? 1 : -1;
        });
    },
    loggedCompany: () => {
        return localStorage.getItem('mySession') || '';
    }
});
