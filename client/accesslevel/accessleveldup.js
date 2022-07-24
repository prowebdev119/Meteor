import {AccessLevelService} from '../js/accesslevel-service';
import {EmployeeProfileService} from '../js/profile-service';
import { ReactiveVar } from 'meteor/reactive-var';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
import '../lib/global/erp-objects';
import {UtilityService} from "../utility-service";
import {AccountService} from "../accounts/account-service";

import 'jquery-editable-select';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();

const _ = require('lodash');
let addNewEmployeesList = [];

Template.accessleveldup.onCreated(()=>{
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.recordsaccess = new ReactiveVar();
    templateObject.accesslevelrecord = new ReactiveVar({});
    templateObject.erpAccessLevelRecord = new ReactiveVar({});
    templateObject.employeename = new ReactiveVar();
    templateObject.employeerecords = new ReactiveVar([]);
    templateObject.newEmployeeID = new ReactiveVar();
    templateObject.employeeID = new ReactiveVar();
    templateObject.employeeformID = new ReactiveVar();
    templateObject.employeeformaccessrecord = new ReactiveVar({});
    templateObject.accessgrouprecord = new ReactiveVar({});


    setTimeout(function () {

        var x = window.matchMedia("(min-width: 1080px)")

        function mediaQuery(x) {
            if (x.matches) {

                $("#buttonsLeft").removeClass("d-xl-flex");
                $("#buttonsLeft").addClass("d-flex");
                $("#buttonsLeft").removeClass("align-items-xl-start");
                $("#buttonsLeft").addClass("align-items-end");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 10);


});
Template.accessleveldup.onRendered(function(){
    const templateObject = Template.instance();
    let tempInstance = Template.instance();
    var employeeProfileService = new EmployeeProfileService();
    const records =[];
    const recordsaccess =[];
    const arrayformid =[];
    const employeeList = [];

    var splashArrayAccess = new Array();
    let accesslevelService = new AccessLevelService();
    var splashArray = new Array();
    var empName = localStorage.getItem('mySession');
    $('.fullScreenSpin').css('display','inline-block');

    templateObject.employeename.set(empName);
    if(FlowRouter.current().queryParams.empuser){

        $([document.documentElement, document.body]).animate({
            scrollTop: $(".employeeModules").offset().top
        }, 2000);
        swal({
            title: 'Please Select the Employee Modules for the Newly Created User',
            text: '',
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
        }).then((result) => {

        });
    }

    getVS1Data('TERPForm').then(function (dataObject) {
      if(dataObject.length == 0){
        accesslevelService.getCloudTERPForm().then(function(data){
          addVS1Data('TERPForm', JSON.stringify(data));
        let lineItemsForm = [];
        let lineItemObjForm = {};
        let isSidePanelFormID = '';
        let isTopPanelFormID = '';
        let itemData = data.terpform.sort(function (a, b) {

          if (a.Description.toLowerCase() == 'NA') {
            return 1;
          }
          else if (b.Description.toLowerCase() == 'NA') {
            return -1;
          }
          return (a.Description.toLowerCase() > b.Description.toLowerCase()) ? 1 : -1;
        });

        for(let i=0; i<itemData.length; i++){
            lineItemObjForm = {
                lineID: itemData[i].Id || '',
                description: itemData[i].Description || '',
                skingroup: itemData[i].SkinsGroup || ''

            };

            if(itemData[i].Description === "Side Panel Menu"){
                isSidePanelFormID = itemData[i].Id;
                Session.setPersistent('CloudSidePanelMenuFormID', isSidePanelFormID);
            }
            if(itemData[i].Description === "Top Panel Menu"){
                isTopPanelFormID = itemData[i].Id;
                Session.setPersistent('CloudTopPanelMenuFormID', isTopPanelFormID);
            }
            lineItemsForm.push(lineItemObjForm);
            splashArray.push(lineItemObjForm);
            templateObject.erpAccessLevelRecord.set(lineItemsForm);

        }

        getTableData('All');

    });
      }else{
        let data = JSON.parse(dataObject[0].data);
        let useData = data.terpform;
        let lineItemsForm = [];
        let lineItemObjForm = {};
        let isSidePanelFormID = '';
        let isTopPanelFormID = '';
        let itemData = data.terpform.sort(function (a, b) {

          if (a.Description.toLowerCase() == 'NA') {
            return 1;
          }
          else if (b.Description.toLowerCase() == 'NA') {
            return -1;
          }
          return (a.Description.toLowerCase() > b.Description.toLowerCase()) ? 1 : -1;
        });

        for(let i=0; i<itemData.length; i++){
            lineItemObjForm = {
                lineID: itemData[i].Id || '',
                description: itemData[i].Description || '',
                skingroup: itemData[i].SkinsGroup || ''

            };

            if(itemData[i].Description === "Side Panel Menu"){
                isSidePanelFormID = itemData[i].Id;
                Session.setPersistent('CloudSidePanelMenuFormID', isSidePanelFormID);
            }
            if(itemData[i].Description === "Top Panel Menu"){
                isTopPanelFormID = itemData[i].Id;
                Session.setPersistent('CloudTopPanelMenuFormID', isTopPanelFormID);
            }
            lineItemsForm.push(lineItemObjForm);
            splashArray.push(lineItemObjForm);
            templateObject.erpAccessLevelRecord.set(lineItemsForm);

        }

        getTableData('All');
      }
    }).catch(function (err) {
      accesslevelService.getCloudTERPForm().then(function(data){
        addVS1Data('TERPForm', JSON.stringify(data));
      let lineItemsForm = [];
      let lineItemObjForm = {};
      let isSidePanelFormID = '';
      let isTopPanelFormID = '';
      let itemData = data.terpform.sort(function (a, b) {

        if (a.Description.toLowerCase() == 'NA') {
          return 1;
        }
        else if (b.Description.toLowerCase() == 'NA') {
          return -1;
        }
        return (a.Description.toLowerCase() > b.Description.toLowerCase()) ? 1 : -1;
      });

      for(let i=0; i<itemData.length; i++){
          lineItemObjForm = {
              lineID: itemData[i].Id || '',
              description: itemData[i].Description || '',
              skingroup: itemData[i].SkinsGroup || ''

          };

          if(itemData[i].Description === "Side Panel Menu"){
              isSidePanelFormID = itemData[i].Id;
              Session.setPersistent('CloudSidePanelMenuFormID', isSidePanelFormID);
          }
          if(itemData[i].Description === "Top Panel Menu"){
              isTopPanelFormID = itemData[i].Id;
              Session.setPersistent('CloudTopPanelMenuFormID', isTopPanelFormID);
          }
          lineItemsForm.push(lineItemObjForm);
          splashArray.push(lineItemObjForm);
          templateObject.erpAccessLevelRecord.set(lineItemsForm);

      }

      getTableData('All');

  });
    });
    if (!localStorage.getItem('VS1TERPFormList')) {

    }else{

    }


    let loggedEmpID = Session.get('mySessionEmployeeLoggedID');

    if((loggedEmpID) && (loggedEmpID !== null)){

        templateObject.employeeID.set(loggedEmpID);
    }

    templateObject.getAllEmployees = function () {
        accesslevelService.getEmployees().then(function (data) {
            let employeeList = [];
            for (let i = 0; i < data.temployee.length; i++) {

                let dataObj = {
                    empID: data.temployee[i].Id || ' ',
                    employeename: data.temployee[i].EmployeeName || ' '
                };

                if(data.temployee[i].EmployeeName.replace(/\s/g, '') != ''){
                    employeeList.push(dataObj);
                }
            }

            templateObject.employeerecords.set(employeeList);
            if(templateObject.employeerecords.get()){

            }


        });
    };

    if(FlowRouter.current().queryParams.empuser){
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".employeeModules").offset().top
        }, 2000);
        let empToSelect = FlowRouter.current().queryParams.empuser;
        let empToSelectID = FlowRouter.current().queryParams.empuserid;
        setTimeout(function () {
            // $('select[name="sltEmployeeName"] option[value="'+empToSelect+'"]').prop('selected', true);
            $('#sltEmployeeName').val(empToSelect);
            $('#mytag').val(empToSelectID);
        }, 100);

    }

    //templateObject.getAllEmployees();

    function getTableData(employeeID){

        /* Lincence Check for Menu Options */
        let isFixedAssetsLicence = Session.get('CloudFixedAssetsLicence');
        let isInventoryLicence = Session.get('CloudInventoryLicence');
        let isManufacturingLicence = Session.get('CloudManufacturingLicence');
        let isPurchasesLicence = Session.get('CloudPurchasesLicence');
        let isSalesLicence = Session.get('CloudSalesLicence');
        let isShippingLicence = Session.get('CloudShippingLicence');
        let isStockTakeLicence = Session.get('CloudStockTakeLicence');
        let isStockTransferLicence = Session.get('CloudStockTransferLicence');
        let isMainLicence = Session.get('CloudMainLicence');
        let isDashboardLicence = Session.get('CloudDashboardLicence');

        /*Licence Check Menu to add */
        let isAccountsLicence = Session.get('CloudAccountsLicence');
        let isContactsLicence = Session.get('CloudContactsLicence');
        let isExpenseClaimsLicence = Session.get('CloudExpenseClaimsLicence');
        let isPaymentsLicence = Session.get('CloudPaymentsLicence');
        let isReportsLicence = Session.get('CloudReportsLicence');
        let isSettingsLicence = Session.get('CloudSettingsLicence');

        let isAppointmentSchedulingLicence = Session.get('CloudAppointmentSchedulingLicence');
        let isPayrollLicence = Session.get('CloudPayrollLicence');
        /*End Licence Check Menu to add */
        /* End Licence Check for menu option */

        if(employeeID == "All"){
            let lineItemslevel = [];
            let lineItemObjlevel = {};
            var groups = {};

            let formClass = '';
            let formClassHidden = '';
            let formAccessLevel = 1;
            var groupName = '';
            if(splashArray.length > 0){

                $.grep(splashArray, function(n) {


                    if((n.description === "Accounts") && (!isAccountsLicence)){
                        formClass = 'activeLicence';

                    }else if((n.description === "Accounts") && (isAccountsLicence)){

                        formClass = '';
                    }else if((n.description === "Appointments") && (!isAppointmentSchedulingLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Appointments") && (isAppointmentSchedulingLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Contacts") && (!isContactsLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Contacts") && (isContactsLicence)){
                        formClass = '';
                    }

                    else if((n.description === "Dashboard") && (!isDashboardLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Dashboard") && (isDashboardLicence)){
                        formClass = '';
                    }

                    else if((n.description === "Expense Claims") && (!isExpenseClaimsLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Expense Claims") && (isExpenseClaimsLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Fixed Assets") && (!isFixedAssetsLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Fixed Assets") && (isFixedAssetsLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Inventory" || n.description === "Inventory Tracking") && (!isInventoryLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Inventory" || n.description === "Inventory Tracking") && (isInventoryLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Main") && (!isMainLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Main") && (isMainLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Manufacturing") && (!isManufacturingLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Manufacturing") && (isManufacturingLicence)){
                        formClass = '';
                    }
                    else if((n.descriptionn === "Payments") && (!isPaymentsLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Payments") && (isPaymentsLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Purchases") && (!isPurchasesLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Purchases") && (isPurchasesLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Reports") && (!isReportsLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Reports") && (isReportsLicence)){
                        formClass = '';
                    }else if((n.description === "Sales") && (!isSalesLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Sales") && (isSalesLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Settings") && (!isSettingsLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Settings") && (isSettingsLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Shipping") && (!isShippingLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Shipping") && (isShippingLicence)){
                        formClass = '';
                    }else if((n.description === "Walk Through Sheet")){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Walk Through Sheet") ){
                        formClass = '';
                    }
                    else if((n.description === "Stock Take") && (!isStockTakeLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Stock Take") && (isStockTakeLicence)){
                        formClass = '';
                    }
                    else if((n.description === "Stock Transfer") && (!isStockTransferLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Stock Transfer") && (isStockTransferLicence)){
                        formClass = '';
                    }else if((n.description === "Payroll") && (!isPayrollLicence)){
                        formClass = 'inactiveLicence';
                    }else if((n.description === "Payroll") && (isPayrollLicence)){
                        formClass = '';
                    }else{
                        formClass = '';
                    }

                    if((n.skingroup === "Accounts") && (n.description === "Accounts")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Appointments") && (n.description === "Appointments")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Employee") && (n.description === "Settings")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "General") && (n.description === "Settings")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Inventory") && (n.description === "Inventory")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Manufacturing") && (n.description === "Manufacturing")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Payments") && (n.description === "Payments")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Purchases") && (n.description === "Purchases")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Sales") && (n.description === "Sales")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Payroll") && (n.description === "Payroll")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Shipping") && (n.description === "Shipping")){
                        formClassHidden = 'hiddenRow';
                    }else{
                      formClassHidden = '';
                    }

                    if(n.description === "Launch Appointment"){
                      formAccessLevel = 0;
                    }else{
                      formAccessLevel = 1;
                    }
                    lineItemObjlevel = {
                        accessID: '' || '',
                        formID: n.lineID || '',
                        lineID: n.lineID || '',
                        skingroup : n.skingroup || '',
                        accessLevel: formAccessLevel || '',
                        accessLevelname: '' || '',
                        description: n.description || '',
                        formName: '' || '',
                        formClass: formClass || '',
                        formClassHidden: formClassHidden || ''
                    };

                    if((n.description != "Fixed Assets") || (n.skingroup != "Fixed Assets")){
                        if((n.description != "TrueERP Mobile Data Export")){
                            groupName = n.skingroup;
                            if (!groups[groupName]) {
                                groups[groupName] = [];
                            }

                            groups[groupName].sort(function(a, b){
                                if (a.description == 'NA') {
                                    return 1;
                                }
                                else if (b.description == 'NA') {
                                    return -1;
                                }
                                return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                            });


                            groups[groupName].push(lineItemObjlevel);
                            splashArrayAccess.push(lineItemObjlevel);
                            lineItemslevel.push(lineItemObjlevel);
                            recordsaccess.push(lineItemObjlevel);
                            templateObject.recordsaccess.set(lineItemObjlevel);
                        }
                    }
                });


                templateObject.accessgrouprecord.set(groups);
                templateObject.accesslevelrecord.set(lineItemslevel);
            }
            let loggedEmpID = Session.get('mySessionEmployeeLoggedID');
            getVS1Data('TEmployeeFormAccessDetail').then(function (dataObject) {
              if(dataObject.length == 0){
                accesslevelService.getEmpFormAccessDetail(loggedEmpID).then(function(data){
                let lineItemslevel = [];
                let lineItemObjlevel = {};
                var groups = {};

                let formClass = '';
                let formClassHidden = '';
                var groupName = '';

                let isPayrollClockOnOff = false;
                let isPayrollTimeSheet = false;
                if(splashArray.length > 0){
                    $.grep(splashArray, function(n) {

                      if((n.skingroup === "Accounts") && (n.description === "Accounts")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Appointments") && (n.description === "Appointments")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Employee") && (n.description === "Settings")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "General") && (n.description === "Settings")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Inventory") && (n.description === "Inventory")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Manufacturing") && (n.description === "Manufacturing")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Payments") && (n.description === "Payments")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Purchases") && (n.description === "Purchases")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Sales") && (n.description === "Sales")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Payroll") && (n.description === "Payroll")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Shipping") && (n.description === "Shipping")){
                          formClassHidden = 'hiddenRow';
                      }else{
                        formClassHidden = '';
                      }


                        lineItemObjlevel = {
                            accessID: '' || '',
                            formID: n.lineID || '',
                            lineID: n.lineID || '',
                            skingroup: n.skingroup || '',
                            accessLevel: '' || '',
                            accessLevelname: '' || '',
                            description: n.description || '',
                            formName: '' || '',
                            formClass: formClass || '',
                            formClassHidden: formClassHidden || ''
                        };
                        if((n.description != "Fixed Assets") || (n.skingroup != "Fixed Assets")){
                            if((n.description != "TrueERP Mobile Data Export")){

                                groupName = n.skingroup;
                                if (!groups[groupName]) {
                                    groups[groupName] = [];
                                }

                                for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {


                                    if(data.temployeeformaccessdetail[i].fields.FormId === n.lineID){

                                        if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (!isAccountsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (isAccountsLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (!isAppointmentSchedulingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (isAppointmentSchedulingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (!isContactsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (isContactsLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (!isDashboardLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (isDashboardLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (!isExpenseClaimsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (isExpenseClaimsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (!isFixedAssetsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (isFixedAssetsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (!isInventoryLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (isInventoryLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (!isMainLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (isMainLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (!isManufacturingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (isManufacturingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (!isPaymentsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (isPaymentsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (!isPurchasesLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (isPurchasesLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (!isReportsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (isReportsLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (!isSalesLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (isSalesLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (!isSettingsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (isSettingsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (!isShippingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (isShippingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (!isStockTakeLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (isStockTakeLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (!isStockTransferLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (isStockTransferLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (!isPayrollLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (isPayrollLicence)){
                                            formClass = '';
                                        }else{
                                            formClass = '';
                                        }

                                        if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Accounts") && (data.temployeeformaccessdetail[i].fields.Description === "Accounts")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Appointments") && (data.temployeeformaccessdetail[i].fields.Description === "Appointments")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Employee") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "General") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Inventory") && (data.temployeeformaccessdetail[i].fields.Description === "Inventory")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                                setTimeout(function () {
                                                $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                                },500);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Manufacturing") && (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payments") && (data.temployeeformaccessdetail[i].fields.Description === "Payments")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Purchases") && (data.temployeeformaccessdetail[i].fields.Description === "Purchases")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Sales") && (data.temployeeformaccessdetail[i].fields.Description === "Sales")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payroll") && (data.temployeeformaccessdetail[i].fields.Description === "Payroll")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Shipping") && (data.temployeeformaccessdetail[i].fields.Description === "Shipping")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                        }else{
                                          formClassHidden = '';
                                        }

                                        lineItemObjlevel = {
                                            accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                                            formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                            lineID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                            skingroup : data.temployeeformaccessdetail[i].fields.SkinsGroup || '',
                                            accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                            accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                            description: data.temployeeformaccessdetail[i].fields.Description || '',
                                            formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                            formClass: formClass || '',
                                            formClassHidden: formClassHidden || ''
                                        };

                                        groupName = data.temployeeformaccessdetail[i].fields.SkinsGroup;
                                        if (!groups[groupName]) {
                                            groups[groupName] = [];
                                        }

                                    }


                                }


                                groups[groupName].sort(function(a, b){
                                    if (a.description == 'NA') {
                                        return 1;
                                    }
                                    else if (b.description == 'NA') {
                                        return -1;
                                    }
                                    return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                                });

                                groups[groupName].push(lineItemObjlevel);

                                splashArrayAccess.push(lineItemObjlevel);
                                lineItemslevel.push(lineItemObjlevel);
                                recordsaccess.push(lineItemObjlevel);
                                templateObject.recordsaccess.set(lineItemObjlevel);
                                templateObject.accessgrouprecord.set(groups);

                            }
                        }
                    });
                }else{
                    for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {
                        if((data.temployeeformaccessdetail[i].fields.Description != "Fixed Assets") || (data.temployeeformaccessdetail[i].fields.SkinsGroup != "Fixed Assets")){
                            if((data.temployeeformaccessdetail[i].fields.Description != "TrueERP Mobile Data Export")){

                                if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (!isAccountsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (isAccountsLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (!isAppointmentSchedulingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (isAppointmentSchedulingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (!isContactsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (isContactsLicence)){
                                    formClass = '';
                                }

                                else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (!isDashboardLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (isDashboardLicence)){
                                    formClass = '';
                                }

                                else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (!isExpenseClaimsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (isExpenseClaimsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (!isFixedAssetsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (isFixedAssetsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (!isInventoryLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (isInventoryLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (!isMainLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (isMainLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (!isManufacturingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (isManufacturingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (!isPaymentsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (isPaymentsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (!isPurchasesLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (isPurchasesLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (!isReportsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (isReportsLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (!isSalesLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (isSalesLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (!isSettingsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (isSettingsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (!isShippingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (isShippingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (!isStockTakeLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (isStockTakeLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (!isStockTransferLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (isStockTransferLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (!isPayrollLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (isPayrollLicence)){
                                    formClass = '';
                                }else{
                                    formClass = '';
                                }

                                if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Accounts") && (data.temployeeformaccessdetail[i].fields.Description === "Accounts")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Appointments") && (data.temployeeformaccessdetail[i].fields.Description === "Appointments")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Employee") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "General") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Inventory") && (data.temployeeformaccessdetail[i].fields.Description === "Inventory")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                        setTimeout(function () {
                                        $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                        },500);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Manufacturing") && (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payments") && (data.temployeeformaccessdetail[i].fields.Description === "Payments")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Purchases") && (data.temployeeformaccessdetail[i].fields.Description === "Purchases")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Sales") && (data.temployeeformaccessdetail[i].fields.Description === "Sales")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payroll") && (data.temployeeformaccessdetail[i].fields.Description === "Payroll")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Shipping") && (data.temployeeformaccessdetail[i].fields.Description === "Shipping")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                                }else{
                                  formClassHidden = '';
                                }

                                lineItemObjlevel = {
                                    accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                                    formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                    lineID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                    skingroup : data.temployeeformaccessdetail[i].fields.SkinsGroup || '',
                                    accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                    accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                    description: data.temployeeformaccessdetail[i].fields.Description || '',
                                    formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                    formClass: formClass || '',
                                    formClassHidden: formClassHidden || ''
                                };



                                var groupName = data.temployeeformaccessdetail[i].fields.SkinsGroup;
                                if (!groups[groupName]) {
                                    groups[groupName] = [];
                                }


                                groups[groupName].sort(function(a, b){
                                    if (a.description == 'NA') {
                                        return 1;
                                    }
                                    else if (b.description == 'NA') {
                                        return -1;
                                    }
                                    return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                                });

                                groups[groupName].push(lineItemObjlevel);


                                splashArrayAccess.push(lineItemObjlevel);
                                lineItemslevel.push(lineItemObjlevel);
                                recordsaccess.push(lineItemObjlevel);
                                templateObject.recordsaccess.set(lineItemObjlevel);
                            }
                        }
                    }

                    templateObject.accessgrouprecord.set(groups);
                }


                // let loggedEmpID = Session.get('mySessionEmployeeLoggedID');
                if((employeeID == loggedEmpID) && (loggedEmpID !== null)){
                    localStorage.setItem('VS1AccessLevelList', JSON.stringify(splashArrayAccess));
                    templateObject.accesslevelrecord.set(lineItemslevel);
                }else{
                    templateObject.accesslevelrecord.set(lineItemslevel);
                }

                templateObject.employeeformaccessrecord.set(lineItemslevel);
                $('.fullScreenSpin').css('display','none');
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');

              });
              }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.temployeeformaccessdetail;
                let lineItemslevel = [];
                let lineItemObjlevel = {};
                var groups = {};

                let formClass = '';
                let formClassHidden = '';
                var groupName = '';

                let isPayrollClockOnOff = false;
                let isPayrollTimeSheet = false;
                if(splashArray.length > 0){
                    $.grep(splashArray, function(n) {

                      if((n.skingroup === "Accounts") && (n.description === "Accounts")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Appointments") && (n.description === "Appointments")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Employee") && (n.description === "Settings")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "General") && (n.description === "Settings")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Inventory") && (n.description === "Inventory")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Manufacturing") && (n.description === "Manufacturing")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Payments") && (n.description === "Payments")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Purchases") && (n.description === "Purchases")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Sales") && (n.description === "Sales")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Payroll") && (n.description === "Payroll")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Shipping") && (n.description === "Shipping")){
                          formClassHidden = 'hiddenRow';
                      }else{
                        formClassHidden = '';
                      }


                        lineItemObjlevel = {
                            accessID: '' || '',
                            formID: n.lineID || '',
                            lineID: n.lineID || '',
                            skingroup: n.skingroup || '',
                            accessLevel: '' || '',
                            accessLevelname: '' || '',
                            description: n.description || '',
                            formName: '' || '',
                            formClass: formClass || '',
                            formClassHidden: formClassHidden || ''
                        };
                        if((n.description != "Fixed Assets") || (n.skingroup != "Fixed Assets")){
                            if((n.description != "TrueERP Mobile Data Export")){

                                groupName = n.skingroup;
                                if (!groups[groupName]) {
                                    groups[groupName] = [];
                                }

                                for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {


                                    if(data.temployeeformaccessdetail[i].fields.FormId === n.lineID){

                                        if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (!isAccountsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (isAccountsLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (!isAppointmentSchedulingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (isAppointmentSchedulingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (!isContactsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (isContactsLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (!isDashboardLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (isDashboardLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (!isExpenseClaimsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (isExpenseClaimsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (!isFixedAssetsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (isFixedAssetsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (!isInventoryLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (isInventoryLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (!isMainLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (isMainLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (!isManufacturingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (isManufacturingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (!isPaymentsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (isPaymentsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (!isPurchasesLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (isPurchasesLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (!isReportsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (isReportsLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (!isSalesLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (isSalesLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (!isSettingsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (isSettingsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (!isShippingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (isShippingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (!isStockTakeLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (isStockTakeLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (!isStockTransferLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (isStockTransferLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (!isPayrollLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (isPayrollLicence)){
                                            formClass = '';
                                        }else{
                                            formClass = '';
                                        }

                                        if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Accounts") && (data.temployeeformaccessdetail[i].fields.Description === "Accounts")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Appointments") && (data.temployeeformaccessdetail[i].fields.Description === "Appointments")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Employee") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "General") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Inventory") && (data.temployeeformaccessdetail[i].fields.Description === "Inventory")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                                setTimeout(function () {
                                                $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                                },500);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Manufacturing") && (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payments") && (data.temployeeformaccessdetail[i].fields.Description === "Payments")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Purchases") && (data.temployeeformaccessdetail[i].fields.Description === "Purchases")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Sales") && (data.temployeeformaccessdetail[i].fields.Description === "Sales")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payroll") && (data.temployeeformaccessdetail[i].fields.Description === "Payroll")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Shipping") && (data.temployeeformaccessdetail[i].fields.Description === "Shipping")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                        }else{
                                          formClassHidden = '';
                                        }

                                        lineItemObjlevel = {
                                            accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                                            formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                            lineID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                            skingroup : data.temployeeformaccessdetail[i].fields.SkinsGroup || '',
                                            accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                            accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                            description: data.temployeeformaccessdetail[i].fields.Description || '',
                                            formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                            formClass: formClass || '',
                                            formClassHidden: formClassHidden || ''
                                        };

                                        groupName = data.temployeeformaccessdetail[i].fields.SkinsGroup;
                                        if (!groups[groupName]) {
                                            groups[groupName] = [];
                                        }

                                    }


                                }


                                groups[groupName].sort(function(a, b){
                                    if (a.description == 'NA') {
                                        return 1;
                                    }
                                    else if (b.description == 'NA') {
                                        return -1;
                                    }
                                    return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                                });

                                groups[groupName].push(lineItemObjlevel);

                                splashArrayAccess.push(lineItemObjlevel);
                                lineItemslevel.push(lineItemObjlevel);
                                recordsaccess.push(lineItemObjlevel);
                                templateObject.recordsaccess.set(lineItemObjlevel);
                                templateObject.accessgrouprecord.set(groups);

                            }
                        }
                    });
                }else{
                    for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {
                        if((data.temployeeformaccessdetail[i].fields.Description != "Fixed Assets") || (data.temployeeformaccessdetail[i].fields.SkinsGroup != "Fixed Assets")){
                            if((data.temployeeformaccessdetail[i].fields.Description != "TrueERP Mobile Data Export")){

                                if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (!isAccountsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (isAccountsLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (!isAppointmentSchedulingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (isAppointmentSchedulingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (!isContactsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (isContactsLicence)){
                                    formClass = '';
                                }

                                else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (!isDashboardLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (isDashboardLicence)){
                                    formClass = '';
                                }

                                else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (!isExpenseClaimsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (isExpenseClaimsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (!isFixedAssetsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (isFixedAssetsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (!isInventoryLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (isInventoryLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (!isMainLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (isMainLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (!isManufacturingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (isManufacturingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (!isPaymentsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (isPaymentsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (!isPurchasesLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (isPurchasesLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (!isReportsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (isReportsLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (!isSalesLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (isSalesLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (!isSettingsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (isSettingsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (!isShippingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (isShippingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (!isStockTakeLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (isStockTakeLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (!isStockTransferLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (isStockTransferLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (!isPayrollLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (isPayrollLicence)){
                                    formClass = '';
                                }else{
                                    formClass = '';
                                }

                                if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Accounts") && (data.temployeeformaccessdetail[i].fields.Description === "Accounts")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Appointments") && (data.temployeeformaccessdetail[i].fields.Description === "Appointments")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Employee") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "General") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Inventory") && (data.temployeeformaccessdetail[i].fields.Description === "Inventory")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                        setTimeout(function () {
                                        $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                        },500);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Manufacturing") && (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payments") && (data.temployeeformaccessdetail[i].fields.Description === "Payments")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Purchases") && (data.temployeeformaccessdetail[i].fields.Description === "Purchases")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Sales") && (data.temployeeformaccessdetail[i].fields.Description === "Sales")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payroll") && (data.temployeeformaccessdetail[i].fields.Description === "Payroll")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Shipping") && (data.temployeeformaccessdetail[i].fields.Description === "Shipping")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                                }else{
                                  formClassHidden = '';
                                }

                                lineItemObjlevel = {
                                    accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                                    formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                    lineID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                    skingroup : data.temployeeformaccessdetail[i].fields.SkinsGroup || '',
                                    accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                    accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                    description: data.temployeeformaccessdetail[i].fields.Description || '',
                                    formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                    formClass: formClass || '',
                                    formClassHidden: formClassHidden || ''
                                };



                                var groupName = data.temployeeformaccessdetail[i].fields.SkinsGroup;
                                if (!groups[groupName]) {
                                    groups[groupName] = [];
                                }


                                groups[groupName].sort(function(a, b){
                                    if (a.description == 'NA') {
                                        return 1;
                                    }
                                    else if (b.description == 'NA') {
                                        return -1;
                                    }
                                    return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                                });

                                groups[groupName].push(lineItemObjlevel);


                                splashArrayAccess.push(lineItemObjlevel);
                                lineItemslevel.push(lineItemObjlevel);
                                recordsaccess.push(lineItemObjlevel);
                                templateObject.recordsaccess.set(lineItemObjlevel);
                            }
                        }
                    }

                    templateObject.accessgrouprecord.set(groups);
                }


                // let loggedEmpID = Session.get('mySessionEmployeeLoggedID');
                if((employeeID == loggedEmpID) && (loggedEmpID !== null)){
                    localStorage.setItem('VS1AccessLevelList', JSON.stringify(splashArrayAccess));
                    templateObject.accesslevelrecord.set(lineItemslevel);
                }else{
                    templateObject.accesslevelrecord.set(lineItemslevel);
                }

                templateObject.employeeformaccessrecord.set(lineItemslevel);
                $('.fullScreenSpin').css('display','none');
              }
            }).catch(function (err) {
              accesslevelService.getEmpFormAccessDetail(loggedEmpID).then(function(data){
              let lineItemslevel = [];
              let lineItemObjlevel = {};
              var groups = {};

              let formClass = '';
              let formClassHidden = '';
              var groupName = '';

              let isPayrollClockOnOff = false;
              let isPayrollTimeSheet = false;
              if(splashArray.length > 0){
                  $.grep(splashArray, function(n) {

                    if((n.skingroup === "Accounts") && (n.description === "Accounts")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Appointments") && (n.description === "Appointments")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Employee") && (n.description === "Settings")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "General") && (n.description === "Settings")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Inventory") && (n.description === "Inventory")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Manufacturing") && (n.description === "Manufacturing")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Payments") && (n.description === "Payments")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Purchases") && (n.description === "Purchases")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Sales") && (n.description === "Sales")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Payroll") && (n.description === "Payroll")){
                        formClassHidden = 'hiddenRow';
                    }else if((n.skingroup === "Shipping") && (n.description === "Shipping")){
                        formClassHidden = 'hiddenRow';
                    }else{
                      formClassHidden = '';
                    }


                      lineItemObjlevel = {
                          accessID: '' || '',
                          formID: n.lineID || '',
                          lineID: n.lineID || '',
                          skingroup: n.skingroup || '',
                          accessLevel: '' || '',
                          accessLevelname: '' || '',
                          description: n.description || '',
                          formName: '' || '',
                          formClass: formClass || '',
                          formClassHidden: formClassHidden || ''
                      };
                      if((n.description != "Fixed Assets") || (n.skingroup != "Fixed Assets")){
                          if((n.description != "TrueERP Mobile Data Export")){

                              groupName = n.skingroup;
                              if (!groups[groupName]) {
                                  groups[groupName] = [];
                              }

                              for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {


                                  if(data.temployeeformaccessdetail[i].fields.FormId === n.lineID){

                                      if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (!isAccountsLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (isAccountsLicence)){
                                          formClass = '';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (!isAppointmentSchedulingLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (isAppointmentSchedulingLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (!isContactsLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (isContactsLicence)){
                                          formClass = '';
                                      }

                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (!isDashboardLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (isDashboardLicence)){
                                          formClass = '';
                                      }

                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (!isExpenseClaimsLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (isExpenseClaimsLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (!isFixedAssetsLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (isFixedAssetsLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (!isInventoryLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (isInventoryLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (!isMainLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (isMainLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (!isManufacturingLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (isManufacturingLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (!isPaymentsLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (isPaymentsLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (!isPurchasesLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (isPurchasesLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (!isReportsLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (isReportsLicence)){
                                          formClass = '';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (!isSalesLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (isSalesLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (!isSettingsLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (isSettingsLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (!isShippingLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (isShippingLicence)){
                                          formClass = '';
                                      }
                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (!isStockTakeLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (isStockTakeLicence)){
                                          formClass = '';
                                      }

                                      else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (!isStockTransferLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (isStockTransferLicence)){
                                          formClass = '';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (!isPayrollLicence)){
                                          formClass = 'inactiveLicence';
                                      }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (isPayrollLicence)){
                                          formClass = '';
                                      }else{
                                          formClass = '';
                                      }

                                      if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Accounts") && (data.temployeeformaccessdetail[i].fields.Description === "Accounts")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Appointments") && (data.temployeeformaccessdetail[i].fields.Description === "Appointments")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Employee") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "General") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Inventory") && (data.temployeeformaccessdetail[i].fields.Description === "Inventory")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Manufacturing") && (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payments") && (data.temployeeformaccessdetail[i].fields.Description === "Payments")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Purchases") && (data.temployeeformaccessdetail[i].fields.Description === "Purchases")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Sales") && (data.temployeeformaccessdetail[i].fields.Description === "Sales")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payroll") && (data.temployeeformaccessdetail[i].fields.Description === "Payroll")){
                                        formClassHidden = 'hiddenRow';
                                        if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                          setTimeout(function () {
                                          $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                          },500);
                                        }
                                      }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Shipping") && (data.temployeeformaccessdetail[i].fields.Description === "Shipping")){
                                        formClassHidden = 'hiddenRow';
                                        if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                          setTimeout(function () {
                                          $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                          },500);
                                        }
                                      }else{
                                        formClassHidden = '';
                                      }

                                      lineItemObjlevel = {
                                          accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                                          formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                          lineID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                          skingroup : data.temployeeformaccessdetail[i].fields.SkinsGroup || '',
                                          accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                          accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                          description: data.temployeeformaccessdetail[i].fields.Description || '',
                                          formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                          formClass: formClass || '',
                                          formClassHidden: formClassHidden || ''
                                      };

                                      groupName = data.temployeeformaccessdetail[i].fields.SkinsGroup;
                                      if (!groups[groupName]) {
                                          groups[groupName] = [];
                                      }

                                  }


                              }


                              groups[groupName].sort(function(a, b){
                                  if (a.description == 'NA') {
                                      return 1;
                                  }
                                  else if (b.description == 'NA') {
                                      return -1;
                                  }
                                  return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                              });

                              groups[groupName].push(lineItemObjlevel);

                              splashArrayAccess.push(lineItemObjlevel);
                              lineItemslevel.push(lineItemObjlevel);
                              recordsaccess.push(lineItemObjlevel);
                              templateObject.recordsaccess.set(lineItemObjlevel);
                              templateObject.accessgrouprecord.set(groups);

                          }
                      }
                  });
              }else{
                  for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {
                      if((data.temployeeformaccessdetail[i].fields.Description != "Fixed Assets") || (data.temployeeformaccessdetail[i].fields.SkinsGroup != "Fixed Assets")){
                          if((data.temployeeformaccessdetail[i].fields.Description != "TrueERP Mobile Data Export")){

                              if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (!isAccountsLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (isAccountsLicence)){
                                  formClass = '';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (!isAppointmentSchedulingLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (isAppointmentSchedulingLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (!isContactsLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (isContactsLicence)){
                                  formClass = '';
                              }

                              else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (!isDashboardLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (isDashboardLicence)){
                                  formClass = '';
                              }

                              else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (!isExpenseClaimsLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (isExpenseClaimsLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (!isFixedAssetsLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (isFixedAssetsLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (!isInventoryLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (isInventoryLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (!isMainLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (isMainLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (!isManufacturingLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (isManufacturingLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (!isPaymentsLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (isPaymentsLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (!isPurchasesLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (isPurchasesLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (!isReportsLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (isReportsLicence)){
                                  formClass = '';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (!isSalesLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (isSalesLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (!isSettingsLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (isSettingsLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (!isShippingLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (isShippingLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (!isStockTakeLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (isStockTakeLicence)){
                                  formClass = '';
                              }
                              else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (!isStockTransferLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (isStockTransferLicence)){
                                  formClass = '';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (!isPayrollLicence)){
                                  formClass = 'inactiveLicence';
                              }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (isPayrollLicence)){
                                  formClass = '';
                              }else{
                                  formClass = '';
                              }

                              if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Accounts") && (data.temployeeformaccessdetail[i].fields.Description === "Accounts")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Appointments") && (data.temployeeformaccessdetail[i].fields.Description === "Appointments")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Employee") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "General") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Inventory") && (data.temployeeformaccessdetail[i].fields.Description === "Inventory")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Manufacturing") && (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payments") && (data.temployeeformaccessdetail[i].fields.Description === "Payments")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Purchases") && (data.temployeeformaccessdetail[i].fields.Description === "Purchases")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Sales") && (data.temployeeformaccessdetail[i].fields.Description === "Sales")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payroll") && (data.temployeeformaccessdetail[i].fields.Description === "Payroll")){
                                formClassHidden = 'hiddenRow';
                                if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                  setTimeout(function () {
                                  $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                  },500);
                                }
                              }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Shipping") && (data.temployeeformaccessdetail[i].fields.Description === "Shipping")){
                                formClassHidden = 'hiddenRow';
                                if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                  setTimeout(function () {
                                  $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                  },500);
                                }
                              }else{
                                formClassHidden = '';
                              }

                              lineItemObjlevel = {
                                  accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                                  formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                  lineID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                  skingroup : data.temployeeformaccessdetail[i].fields.SkinsGroup || '',
                                  accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                  accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                  description: data.temployeeformaccessdetail[i].fields.Description || '',
                                  formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                  formClass: formClass || '',
                                  formClassHidden: formClassHidden || ''
                              };



                              var groupName = data.temployeeformaccessdetail[i].fields.SkinsGroup;
                              if (!groups[groupName]) {
                                  groups[groupName] = [];
                              }


                              groups[groupName].sort(function(a, b){
                                  if (a.description == 'NA') {
                                      return 1;
                                  }
                                  else if (b.description == 'NA') {
                                      return -1;
                                  }
                                  return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                              });

                              groups[groupName].push(lineItemObjlevel);


                              splashArrayAccess.push(lineItemObjlevel);
                              lineItemslevel.push(lineItemObjlevel);
                              recordsaccess.push(lineItemObjlevel);
                              templateObject.recordsaccess.set(lineItemObjlevel);
                          }
                      }
                  }

                  templateObject.accessgrouprecord.set(groups);
              }


              // let loggedEmpID = Session.get('mySessionEmployeeLoggedID');
              if((employeeID == loggedEmpID) && (loggedEmpID !== null)){
                  localStorage.setItem('VS1AccessLevelList', JSON.stringify(splashArrayAccess));
                  templateObject.accesslevelrecord.set(lineItemslevel);
              }else{
                  templateObject.accesslevelrecord.set(lineItemslevel);
              }

              templateObject.employeeformaccessrecord.set(lineItemslevel);
              $('.fullScreenSpin').css('display','none');
          }).catch(function (err) {
              $('.fullScreenSpin').css('display', 'none');

              });
            });
            $('.fullScreenSpin').css('display','none');
        }else{

            accesslevelService.getEmpFormAccessDetail(employeeID).then(function(data){
                let lineItemslevel = [];
                let lineItemObjlevel = {};
                var groups = {};

                let formClass = '';
                let formClassHidden = '';
                var groupName = '';

                let isPayrollClockOnOff = false;
                let isPayrollTimeSheet = false;
                if(splashArray.length > 0){
                    $.grep(splashArray, function(n) {
                      if((n.skingroup === "Accounts") && (n.description === "Accounts")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Appointments") && (n.description === "Appointments")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Employee") && (n.description === "Settings")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "General") && (n.description === "Settings")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Inventory") && (n.description === "Inventory")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Manufacturing") && (n.description === "Manufacturing")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Payments") && (n.description === "Payments")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Purchases") && (n.description === "Purchases")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Sales") && (n.description === "Sales")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Payroll") && (n.description === "Payroll")){
                          formClassHidden = 'hiddenRow';
                      }else if((n.skingroup === "Shipping") && (n.description === "Shipping")){
                          formClassHidden = 'hiddenRow';
                      }else{
                        formClassHidden = '';
                      }


                        lineItemObjlevel = {
                            accessID: '' || '',
                            formID: n.lineID || '',
                            lineID: n.lineID || '',
                            skingroup: n.skingroup || '',
                            accessLevel: '' || '',
                            accessLevelname: '' || '',
                            description: n.description || '',
                            formName: '' || '',
                            formClass: formClass || '',
                            formClassHidden: formClassHidden || ''
                        };
                        if((n.description != "Fixed Assets") || (n.skingroup != "Fixed Assets")){
                            if((n.description != "TrueERP Mobile Data Export")){

                                groupName = n.skingroup;
                                if (!groups[groupName]) {
                                    groups[groupName] = [];
                                }

                                for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {


                                    if(data.temployeeformaccessdetail[i].fields.FormId === n.lineID){

                                        if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (!isAccountsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (isAccountsLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (!isAppointmentSchedulingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (isAppointmentSchedulingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (!isContactsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (isContactsLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (!isDashboardLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (isDashboardLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (!isExpenseClaimsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (isExpenseClaimsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (!isFixedAssetsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (isFixedAssetsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (!isInventoryLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (isInventoryLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (!isMainLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (isMainLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (!isManufacturingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (isManufacturingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (!isPaymentsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (isPaymentsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (!isPurchasesLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (isPurchasesLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (!isReportsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (isReportsLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (!isSalesLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (isSalesLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (!isSettingsLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (isSettingsLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (!isShippingLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (isShippingLicence)){
                                            formClass = '';
                                        }
                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (!isStockTakeLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (isStockTakeLicence)){
                                            formClass = '';
                                        }

                                        else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (!isStockTransferLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (isStockTransferLicence)){
                                            formClass = '';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (!isPayrollLicence)){
                                            formClass = 'inactiveLicence';
                                        }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (isPayrollLicence)){
                                            formClass = '';
                                        }else{
                                            formClass = '';
                                        }

                                        if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Accounts") && (data.temployeeformaccessdetail[i].fields.Description === "Accounts")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Appointments") && (data.temployeeformaccessdetail[i].fields.Description === "Appointments")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Employee") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "General") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Inventory") && (data.temployeeformaccessdetail[i].fields.Description === "Inventory")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                                setTimeout(function () {
                                                $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                                },500);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Manufacturing") && (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payments") && (data.temployeeformaccessdetail[i].fields.Description === "Payments")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Purchases") && (data.temployeeformaccessdetail[i].fields.Description === "Purchases")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Sales") && (data.temployeeformaccessdetail[i].fields.Description === "Sales")){
                                            formClassHidden = 'hiddenRow';
                                            if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                              setTimeout(function () {
                                              $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                              },500);
                                            }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payroll") && (data.temployeeformaccessdetail[i].fields.Description === "Payroll")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                        }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Shipping") && (data.temployeeformaccessdetail[i].fields.Description === "Shipping")){
                                          formClassHidden = 'hiddenRow';
                                          if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                            setTimeout(function () {
                                            $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                            },500);
                                          }
                                        }else{
                                          formClassHidden = '';
                                        }

                                        lineItemObjlevel = {
                                            accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                                            formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                            lineID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                            skingroup : data.temployeeformaccessdetail[i].fields.SkinsGroup || '',
                                            accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                            accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                            description: data.temployeeformaccessdetail[i].fields.Description || '',
                                            formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                            formClass: formClass || '',
                                            formClassHidden: formClassHidden || ''
                                        };

                                        groupName = data.temployeeformaccessdetail[i].fields.SkinsGroup;
                                        if (!groups[groupName]) {
                                            groups[groupName] = [];
                                        }

                                    }


                                }


                                groups[groupName].sort(function(a, b){
                                    if (a.description == 'NA') {
                                        return 1;
                                    }
                                    else if (b.description == 'NA') {
                                        return -1;
                                    }
                                    return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                                });

                                groups[groupName].push(lineItemObjlevel);

                                splashArrayAccess.push(lineItemObjlevel);
                                lineItemslevel.push(lineItemObjlevel);
                                recordsaccess.push(lineItemObjlevel);
                                templateObject.recordsaccess.set(lineItemObjlevel);
                                templateObject.accessgrouprecord.set(groups);

                            }
                        }
                    });
                }else{
                    for (let i = 0; i < data.temployeeformaccessdetail.length; i++) {
                        if((data.temployeeformaccessdetail[i].fields.Description != "Fixed Assets") || (data.temployeeformaccessdetail[i].fields.SkinsGroup != "Fixed Assets")){
                            if((data.temployeeformaccessdetail[i].fields.Description != "TrueERP Mobile Data Export")){

                                if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (!isAccountsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Accounts") && (isAccountsLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (!isAppointmentSchedulingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Appointments") && (isAppointmentSchedulingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (!isContactsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Contacts") && (isContactsLicence)){
                                    formClass = '';
                                }

                                else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (!isDashboardLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Dashboard") && (isDashboardLicence)){
                                    formClass = '';
                                }

                                else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (!isExpenseClaimsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Expense Claims") && (isExpenseClaimsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (!isFixedAssetsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Fixed Assets") && (isFixedAssetsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (!isInventoryLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Inventory" || data.temployeeformaccessdetail[i].fields.Description === "Inventory Tracking") && (isInventoryLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (!isMainLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Main") && (isMainLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (!isManufacturingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Manufacturing") && (isManufacturingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (!isPaymentsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payments") && (isPaymentsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (!isPurchasesLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Purchases") && (isPurchasesLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (!isReportsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Reports") && (isReportsLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (!isSalesLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Sales") && (isSalesLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (!isSettingsLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Settings") && (isSettingsLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (!isShippingLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Shipping") && (isShippingLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (!isStockTakeLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Take") && (isStockTakeLicence)){
                                    formClass = '';
                                }
                                else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (!isStockTransferLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Stock Transfer") && (isStockTransferLicence)){
                                    formClass = '';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (!isPayrollLicence)){
                                    formClass = 'inactiveLicence';
                                }else if((data.temployeeformaccessdetail[i].fields.Description === "Payroll") && (isPayrollLicence)){
                                    formClass = '';
                                }else{
                                    formClass = '';
                                }

                                if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Accounts") && (data.temployeeformaccessdetail[i].fields.Description === "Accounts")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Appointments") && (data.temployeeformaccessdetail[i].fields.Description === "Appointments")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Employee") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "General") && (data.temployeeformaccessdetail[i].fields.Description === "Settings")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Inventory") && (data.temployeeformaccessdetail[i].fields.Description === "Inventory")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                        setTimeout(function () {
                                        $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                        },500);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Manufacturing") && (data.temployeeformaccessdetail[i].fields.Description === "Manufacturing")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payments") && (data.temployeeformaccessdetail[i].fields.Description === "Payments")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Purchases") && (data.temployeeformaccessdetail[i].fields.Description === "Purchases")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Sales") && (data.temployeeformaccessdetail[i].fields.Description === "Sales")){
                                    formClassHidden = 'hiddenRow';
                                    if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                      setTimeout(function () {
                                      $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                      },500);
                                    }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Payroll") && (data.temployeeformaccessdetail[i].fields.Description === "Payroll")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                                }else if((data.temployeeformaccessdetail[i].fields.SkinsGroup === "Shipping") && (data.temployeeformaccessdetail[i].fields.Description === "Shipping")){
                                  formClassHidden = 'hiddenRow';
                                  if(data.temployeeformaccessdetail[i].fields.AccessLevel == 6){
                                    setTimeout(function () {
                                    $('#formCheck-' + data.temployeeformaccessdetail[i].fields.SkinsGroup + '').prop("checked", false);
                                    },500);
                                  }
                                }else{
                                  formClassHidden = '';
                                }

                                lineItemObjlevel = {
                                    accessID: data.temployeeformaccessdetail[i].fields.ID || '',
                                    formID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                    lineID: data.temployeeformaccessdetail[i].fields.FormId || '',
                                    skingroup : data.temployeeformaccessdetail[i].fields.SkinsGroup || '',
                                    accessLevel: data.temployeeformaccessdetail[i].fields.AccessLevel || '',
                                    accessLevelname: data.temployeeformaccessdetail[i].fields.AccessLevelName || '',
                                    description: data.temployeeformaccessdetail[i].fields.Description || '',
                                    formName: data.temployeeformaccessdetail[i].fields.FormName || '',
                                    formClass: formClass || '',
                                    formClassHidden: formClassHidden || ''
                                };



                                var groupName = data.temployeeformaccessdetail[i].fields.SkinsGroup;
                                if (!groups[groupName]) {
                                    groups[groupName] = [];
                                }


                                groups[groupName].sort(function(a, b){
                                    if (a.description == 'NA') {
                                        return 1;
                                    }
                                    else if (b.description == 'NA') {
                                        return -1;
                                    }
                                    return (a.description.toUpperCase() > b.description.toUpperCase()) ? 1 : -1;
                                });

                                groups[groupName].push(lineItemObjlevel);


                                splashArrayAccess.push(lineItemObjlevel);
                                lineItemslevel.push(lineItemObjlevel);
                                recordsaccess.push(lineItemObjlevel);
                                templateObject.recordsaccess.set(lineItemObjlevel);
                            }
                        }
                    }

                    templateObject.accessgrouprecord.set(groups);
                }


                let loggedEmpID = Session.get('mySessionEmployeeLoggedID');
                if((employeeID == loggedEmpID) && (loggedEmpID !== null)){
                    localStorage.setItem('VS1AccessLevelList', JSON.stringify(splashArrayAccess));
                    templateObject.accesslevelrecord.set(lineItemslevel);
                }else{
                    templateObject.accesslevelrecord.set(lineItemslevel);
                }

                templateObject.employeeformaccessrecord.set(lineItemslevel);
                $('.fullScreenSpin').css('display','none');
            }).catch(function (err) {
                $('.fullScreenSpin').css('display', 'none');

            });
        }

    }

    // $("#sltEmployeeName").change(function(event){
    //
    //     $('.fullScreenSpin').css('display','inline-block');
    //     let employeeName = $(event.target).val();
    //     let employeeID = $('option:selected', event.target).attr('mytag');
    //
    //
    //     if(employeeID){
    //         templateObject.accessgrouprecord.set('');
    //         getTableData(employeeID);
    //
    //     }else{
    //         getTableData('All');
    //     }
    //
    //     $('.employeeNameHead span').text(employeeName);
    // });

    $(document).ready(function() {
        $('#sltEmployeeName').editableSelect();
        $("#sltEmployeeName").val('All');
        $('#mytag').val(0);
    });

    $('#sltEmployeeName').editableSelect()
    .on('click.editable-select', function (e, li) {
        var $earch = $(this);
        var offset = $earch.offset();
        $('#edtEmployeePOPID').val('');
        //$('#edtCustomerCompany').attr('readonly', false);
        var employeeDataName = e.target.value || '';
        if (e.pageX > offset.left + $earch.width() - 8) { // X button 16px wide?
            $('#employeeListPOPModal').modal();
            setTimeout(function () {
                $('#tblEmployeelist_filter .form-control-sm').focus();
                $('#tblEmployeelist_filter .form-control-sm').val('');
                $('#tblEmployeelist_filter .form-control-sm').trigger("input");
                var datatable = $('#tblEmployeelist').DataTable();
                //datatable.clear();
                //datatable.rows.add(splashArrayCustomerList);
                datatable.draw();
                $('#tblEmployeelist_filter .form-control-sm').trigger("input");
                //$('#tblEmployeelist').dataTable().fnFilter(' ').draw(false);
            }, 500);
        } else {
            if (employeeDataName.replace(/\s/g, '') != '') {
                //FlowRouter.go('/customerscard?name=' + e.target.value);
              if (employeeDataName.replace(/\s/g, '') != 'All') {
                $('#edtEmployeePOPID').val('');
                getVS1Data('TEmployee').then(function (dataObject) {
                    if (dataObject.length == 0) {
                        $('.fullScreenSpin').css('display', 'inline-block');
                        sideBarService.getOneCustomerDataExByName(employeeDataName).then(function (data) {
                            $('.fullScreenSpin').css('display', 'none');
                            let lineItems = [];
                            $('#add-customer-title').text('Edit Customer');
                            let popCustomerID = data.tcustomer[0].fields.ID || '';
                            let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                            let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                            let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                            let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                            let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                            let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                            let popCustomertfn = '' || '';
                            let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                            let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                            let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                            let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                            let popCustomerURL = data.tcustomer[0].fields.URL || '';
                            let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                            let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                            let popCustomerState = data.tcustomer[0].fields.State || '';
                            let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                            let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                            let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                            let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                            let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                            let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                            let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                            let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                            let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                            let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                            let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                            let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                            let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                            let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                            let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                            let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                            let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                            let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                            let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                            let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                            let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                            let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                            //$('#edtCustomerCompany').attr('readonly', true);
                            $('#edtCustomerCompany').val(popCustomerName);
                            $('#edtEmployeePOPID').val(popCustomerID);
                            $('#edtCustomerPOPEmail').val(popCustomerEmail);
                            $('#edtTitle').val(popCustomerTitle);
                            $('#edtFirstName').val(popCustomerFirstName);
                            $('#edtMiddleName').val(popCustomerMiddleName);
                            $('#edtLastName').val(popCustomerLastName);
                            $('#edtCustomerPhone').val(popCustomerPhone);
                            $('#edtCustomerMobile').val(popCustomerMobile);
                            $('#edtCustomerFax').val(popCustomerFaxnumber);
                            $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                            $('#edtCustomerWebsite').val(popCustomerURL);
                            $('#edtCustomerShippingAddress').val(popCustomerStreet);
                            $('#edtCustomerShippingCity').val(popCustomerStreet2);
                            $('#edtCustomerShippingState').val(popCustomerState);
                            $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                            $('#sedtCountry').val(popCustomerCountry);
                            $('#txaNotes').val(popCustomernotes);
                            $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                            $('#sltTermsPOP').val(popCustomerterms);
                            $('#sltCustomerType').val(popCustomerType);
                            $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                            $('#edtCustomeField1').val(popCustomercustfield1);
                            $('#edtCustomeField2').val(popCustomercustfield2);
                            $('#edtCustomeField3').val(popCustomercustfield3);
                            $('#edtCustomeField4').val(popCustomercustfield4);

                            $('#sltTaxCode').val(popCustomerTaxCode);

                            if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                $('#chkSameAsShipping2').attr("checked", "checked");
                            }

                            if (data.tcustomer[0].fields.IsSupplier == true) {
                                // $('#isformcontractor')
                                $('#chkSameAsSupplier').attr("checked", "checked");
                            } else {
                                $('#chkSameAsSupplier').removeAttr("checked");
                            }

                            setTimeout(function () {
                                $('#addEmployeeModal').modal('show');
                            }, 200);
                        }).catch(function (err) {
                            $('.fullScreenSpin').css('display', 'none');
                        });
                    } else {
                        let data = JSON.parse(dataObject[0].data);
                        let useData = data.tcustomervs1;

                        var added = false;
                        for (let i = 0; i < data.tcustomervs1.length; i++) {
                            if (data.tcustomervs1[i].fields.ClientName === employeeDataName) {
                                let lineItems = [];
                                added = true;
                                $('.fullScreenSpin').css('display', 'none');
                                $('#add-customer-title').text('Edit Customer');
                                let popCustomerID = data.tcustomervs1[i].fields.ID || '';
                                let popCustomerName = data.tcustomervs1[i].fields.ClientName || '';
                                let popCustomerEmail = data.tcustomervs1[i].fields.Email || '';
                                let popCustomerTitle = data.tcustomervs1[i].fields.Title || '';
                                let popCustomerFirstName = data.tcustomervs1[i].fields.FirstName || '';
                                let popCustomerMiddleName = data.tcustomervs1[i].fields.CUSTFLD10 || '';
                                let popCustomerLastName = data.tcustomervs1[i].fields.LastName || '';
                                let popCustomertfn = '' || '';
                                let popCustomerPhone = data.tcustomervs1[i].fields.Phone || '';
                                let popCustomerMobile = data.tcustomervs1[i].fields.Mobile || '';
                                let popCustomerFaxnumber = data.tcustomervs1[i].fields.Faxnumber || '';
                                let popCustomerSkypeName = data.tcustomervs1[i].fields.SkypeName || '';
                                let popCustomerURL = data.tcustomervs1[i].fields.URL || '';
                                let popCustomerStreet = data.tcustomervs1[i].fields.Street || '';
                                let popCustomerStreet2 = data.tcustomervs1[i].fields.Street2 || '';
                                let popCustomerState = data.tcustomervs1[i].fields.State || '';
                                let popCustomerPostcode = data.tcustomervs1[i].fields.Postcode || '';
                                let popCustomerCountry = data.tcustomervs1[i].fields.Country || LoggedCountry;
                                let popCustomerbillingaddress = data.tcustomervs1[i].fields.BillStreet || '';
                                let popCustomerbcity = data.tcustomervs1[i].fields.BillStreet2 || '';
                                let popCustomerbstate = data.tcustomervs1[i].fields.BillState || '';
                                let popCustomerbpostalcode = data.tcustomervs1[i].fields.BillPostcode || '';
                                let popCustomerbcountry = data.tcustomervs1[i].fields.Billcountry || LoggedCountry;
                                let popCustomercustfield1 = data.tcustomervs1[i].fields.CUSTFLD1 || '';
                                let popCustomercustfield2 = data.tcustomervs1[i].fields.CUSTFLD2 || '';
                                let popCustomercustfield3 = data.tcustomervs1[i].fields.CUSTFLD3 || '';
                                let popCustomercustfield4 = data.tcustomervs1[i].fields.CUSTFLD4 || '';
                                let popCustomernotes = data.tcustomervs1[i].fields.Notes || '';
                                let popCustomerpreferedpayment = data.tcustomervs1[i].fields.PaymentMethodName || '';
                                let popCustomerterms = data.tcustomervs1[i].fields.TermsName || '';
                                let popCustomerdeliverymethod = data.tcustomervs1[i].fields.ShippingMethodName || '';
                                let popCustomeraccountnumber = data.tcustomervs1[i].fields.ClientNo || '';
                                let popCustomerisContractor = data.tcustomervs1[i].fields.Contractor || false;
                                let popCustomerissupplier = data.tcustomervs1[i].fields.IsSupplier || false;
                                let popCustomeriscustomer = data.tcustomervs1[i].fields.IsCustomer || false;
                                let popCustomerTaxCode = data.tcustomervs1[i].fields.TaxCodeName || '';
                                let popCustomerDiscount = data.tcustomervs1[i].fields.Discount || 0;
                                let popCustomerType = data.tcustomervs1[i].fields.ClientTypeName || '';
                                //$('#edtCustomerCompany').attr('readonly', true);
                                $('#edtCustomerCompany').val(popCustomerName);
                                $('#edtEmployeePOPID').val(popCustomerID);
                                $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                $('#edtTitle').val(popCustomerTitle);
                                $('#edtFirstName').val(popCustomerFirstName);
                                $('#edtMiddleName').val(popCustomerMiddleName);
                                $('#edtLastName').val(popCustomerLastName);
                                $('#edtCustomerPhone').val(popCustomerPhone);
                                $('#edtCustomerMobile').val(popCustomerMobile);
                                $('#edtCustomerFax').val(popCustomerFaxnumber);
                                $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                $('#edtCustomerWebsite').val(popCustomerURL);
                                $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                $('#edtCustomerShippingState').val(popCustomerState);
                                $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                $('#sedtCountry').val(popCustomerCountry);
                                $('#txaNotes').val(popCustomernotes);
                                $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                $('#sltTermsPOP').val(popCustomerterms);
                                $('#sltCustomerType').val(popCustomerType);
                                $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                $('#edtCustomeField1').val(popCustomercustfield1);
                                $('#edtCustomeField2').val(popCustomercustfield2);
                                $('#edtCustomeField3').val(popCustomercustfield3);
                                $('#edtCustomeField4').val(popCustomercustfield4);

                                $('#sltTaxCode').val(popCustomerTaxCode);

                                if ((data.tcustomervs1[i].fields.Street == data.tcustomervs1[i].fields.BillStreet) && (data.tcustomervs1[i].fields.Street2 == data.tcustomervs1[i].fields.BillStreet2) &&
                                    (data.tcustomervs1[i].fields.State == data.tcustomervs1[i].fields.BillState) && (data.tcustomervs1[i].fields.Postcode == data.tcustomervs1[i].fields.BillPostcode) &&
                                    (data.tcustomervs1[i].fields.Country == data.tcustomervs1[i].fields.Billcountry)) {
                                    $('#chkSameAsShipping2').attr("checked", "checked");
                                }

                                if (data.tcustomervs1[i].fields.IsSupplier == true) {
                                    // $('#isformcontractor')
                                    $('#chkSameAsSupplier').attr("checked", "checked");
                                } else {
                                    $('#chkSameAsSupplier').removeAttr("checked");
                                }

                                setTimeout(function () {
                                    $('#addEmployeeModal').modal('show');
                                }, 200);

                            }
                        }
                        if (!added) {
                            $('.fullScreenSpin').css('display', 'inline-block');
                            sideBarService.getOneCustomerDataExByName(employeeDataName).then(function (data) {
                                $('.fullScreenSpin').css('display', 'none');
                                let lineItems = [];
                                $('#add-customer-title').text('Edit Customer');
                                let popCustomerID = data.tcustomer[0].fields.ID || '';
                                let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                                let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                                let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                                let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                                let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                                let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                                let popCustomertfn = '' || '';
                                let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                                let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                                let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                                let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                                let popCustomerURL = data.tcustomer[0].fields.URL || '';
                                let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                                let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                                let popCustomerState = data.tcustomer[0].fields.State || '';
                                let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                                let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                                let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                                let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                                let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                                let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                                let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                                let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                                let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                                let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                                let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                                let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                                let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                                let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                                let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                                let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                                let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                                let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                                let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                                let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                                let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                                let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                                //$('#edtCustomerCompany').attr('readonly', true);
                                $('#edtCustomerCompany').val(popCustomerName);
                                $('#edtEmployeePOPID').val(popCustomerID);
                                $('#edtCustomerPOPEmail').val(popCustomerEmail);
                                $('#edtTitle').val(popCustomerTitle);
                                $('#edtFirstName').val(popCustomerFirstName);
                                $('#edtMiddleName').val(popCustomerMiddleName);
                                $('#edtLastName').val(popCustomerLastName);
                                $('#edtCustomerPhone').val(popCustomerPhone);
                                $('#edtCustomerMobile').val(popCustomerMobile);
                                $('#edtCustomerFax').val(popCustomerFaxnumber);
                                $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                                $('#edtCustomerWebsite').val(popCustomerURL);
                                $('#edtCustomerShippingAddress').val(popCustomerStreet);
                                $('#edtCustomerShippingCity').val(popCustomerStreet2);
                                $('#edtCustomerShippingState').val(popCustomerState);
                                $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                                $('#sedtCountry').val(popCustomerCountry);
                                $('#txaNotes').val(popCustomernotes);
                                $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                                $('#sltTermsPOP').val(popCustomerterms);
                                $('#sltCustomerType').val(popCustomerType);
                                $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                                $('#edtCustomeField1').val(popCustomercustfield1);
                                $('#edtCustomeField2').val(popCustomercustfield2);
                                $('#edtCustomeField3').val(popCustomercustfield3);
                                $('#edtCustomeField4').val(popCustomercustfield4);

                                $('#sltTaxCode').val(popCustomerTaxCode);

                                if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                                    (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                                    (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                                    $('#chkSameAsShipping2').attr("checked", "checked");
                                }

                                if (data.tcustomer[0].fields.IsSupplier == true) {
                                    // $('#isformcontractor')
                                    $('#chkSameAsSupplier').attr("checked", "checked");
                                } else {
                                    $('#chkSameAsSupplier').removeAttr("checked");
                                }

                                setTimeout(function () {
                                    $('#addEmployeeModal').modal('show');
                                }, 200);
                            }).catch(function (err) {
                                $('.fullScreenSpin').css('display', 'none');
                            });
                        }
                    }
                }).catch(function (err) {
                    sideBarService.getOneCustomerDataExByName(employeeDataName).then(function (data) {
                        $('.fullScreenSpin').css('display', 'none');
                        let lineItems = [];
                        $('#add-customer-title').text('Edit Customer');
                        let popCustomerID = data.tcustomer[0].fields.ID || '';
                        let popCustomerName = data.tcustomer[0].fields.ClientName || '';
                        let popCustomerEmail = data.tcustomer[0].fields.Email || '';
                        let popCustomerTitle = data.tcustomer[0].fields.Title || '';
                        let popCustomerFirstName = data.tcustomer[0].fields.FirstName || '';
                        let popCustomerMiddleName = data.tcustomer[0].fields.CUSTFLD10 || '';
                        let popCustomerLastName = data.tcustomer[0].fields.LastName || '';
                        let popCustomertfn = '' || '';
                        let popCustomerPhone = data.tcustomer[0].fields.Phone || '';
                        let popCustomerMobile = data.tcustomer[0].fields.Mobile || '';
                        let popCustomerFaxnumber = data.tcustomer[0].fields.Faxnumber || '';
                        let popCustomerSkypeName = data.tcustomer[0].fields.SkypeName || '';
                        let popCustomerURL = data.tcustomer[0].fields.URL || '';
                        let popCustomerStreet = data.tcustomer[0].fields.Street || '';
                        let popCustomerStreet2 = data.tcustomer[0].fields.Street2 || '';
                        let popCustomerState = data.tcustomer[0].fields.State || '';
                        let popCustomerPostcode = data.tcustomer[0].fields.Postcode || '';
                        let popCustomerCountry = data.tcustomer[0].fields.Country || LoggedCountry;
                        let popCustomerbillingaddress = data.tcustomer[0].fields.BillStreet || '';
                        let popCustomerbcity = data.tcustomer[0].fields.BillStreet2 || '';
                        let popCustomerbstate = data.tcustomer[0].fields.BillState || '';
                        let popCustomerbpostalcode = data.tcustomer[0].fields.BillPostcode || '';
                        let popCustomerbcountry = data.tcustomer[0].fields.Billcountry || LoggedCountry;
                        let popCustomercustfield1 = data.tcustomer[0].fields.CUSTFLD1 || '';
                        let popCustomercustfield2 = data.tcustomer[0].fields.CUSTFLD2 || '';
                        let popCustomercustfield3 = data.tcustomer[0].fields.CUSTFLD3 || '';
                        let popCustomercustfield4 = data.tcustomer[0].fields.CUSTFLD4 || '';
                        let popCustomernotes = data.tcustomer[0].fields.Notes || '';
                        let popCustomerpreferedpayment = data.tcustomer[0].fields.PaymentMethodName || '';
                        let popCustomerterms = data.tcustomer[0].fields.TermsName || '';
                        let popCustomerdeliverymethod = data.tcustomer[0].fields.ShippingMethodName || '';
                        let popCustomeraccountnumber = data.tcustomer[0].fields.ClientNo || '';
                        let popCustomerisContractor = data.tcustomer[0].fields.Contractor || false;
                        let popCustomerissupplier = data.tcustomer[0].fields.IsSupplier || false;
                        let popCustomeriscustomer = data.tcustomer[0].fields.IsCustomer || false;
                        let popCustomerTaxCode = data.tcustomer[0].fields.TaxCodeName || '';
                        let popCustomerDiscount = data.tcustomer[0].fields.Discount || 0;
                        let popCustomerType = data.tcustomer[0].fields.ClientTypeName || '';
                        //$('#edtCustomerCompany').attr('readonly', true);
                        $('#edtCustomerCompany').val(popCustomerName);
                        $('#edtEmployeePOPID').val(popCustomerID);
                        $('#edtCustomerPOPEmail').val(popCustomerEmail);
                        $('#edtTitle').val(popCustomerTitle);
                        $('#edtFirstName').val(popCustomerFirstName);
                        $('#edtMiddleName').val(popCustomerMiddleName);
                        $('#edtLastName').val(popCustomerLastName);
                        $('#edtCustomerPhone').val(popCustomerPhone);
                        $('#edtCustomerMobile').val(popCustomerMobile);
                        $('#edtCustomerFax').val(popCustomerFaxnumber);
                        $('#edtCustomerSkypeID').val(popCustomerSkypeName);
                        $('#edtCustomerWebsite').val(popCustomerURL);
                        $('#edtCustomerShippingAddress').val(popCustomerStreet);
                        $('#edtCustomerShippingCity').val(popCustomerStreet2);
                        $('#edtCustomerShippingState').val(popCustomerState);
                        $('#edtCustomerShippingZIP').val(popCustomerPostcode);
                        $('#sedtCountry').val(popCustomerCountry);
                        $('#txaNotes').val(popCustomernotes);
                        $('#sltPreferedPayment').val(popCustomerpreferedpayment);
                        $('#sltTermsPOP').val(popCustomerterms);
                        $('#sltCustomerType').val(popCustomerType);
                        $('#edtCustomerCardDiscount').val(popCustomerDiscount);
                        $('#edtCustomeField1').val(popCustomercustfield1);
                        $('#edtCustomeField2').val(popCustomercustfield2);
                        $('#edtCustomeField3').val(popCustomercustfield3);
                        $('#edtCustomeField4').val(popCustomercustfield4);

                        $('#sltTaxCode').val(popCustomerTaxCode);

                        if ((data.tcustomer[0].fields.Street == data.tcustomer[0].fields.BillStreet) && (data.tcustomer[0].fields.Street2 == data.tcustomer[0].fields.BillStreet2) &&
                            (data.tcustomer[0].fields.State == data.tcustomer[0].fields.BillState) && (data.tcustomer[0].fields.Postcode == data.tcustomer[0].fields.BillPostcode) &&
                            (data.tcustomer[0].fields.Country == data.tcustomer[0].fields.Billcountry)) {
                            $('#chkSameAsShipping2').attr("checked", "checked");
                        }

                        if (data.tcustomer[0].fields.IsSupplier == true) {
                            // $('#isformcontractor')
                            $('#chkSameAsSupplier').attr("checked", "checked");
                        } else {
                            $('#chkSameAsSupplier').removeAttr("checked");
                        }

                        setTimeout(function () {
                            $('#addEmployeeModal').modal('show');
                        }, 200);
                    }).catch(function (err) {
                        $('.fullScreenSpin').css('display', 'none');
                    });
                });
              }else{
                $('#employeeListPOPModal').modal();
                setTimeout(function () {
                    $('#tblEmployeelist_filter .form-control-sm').focus();
                    $('#tblEmployeelist_filter .form-control-sm').val('');
                    $('#tblEmployeelist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblEmployeelist').DataTable();
                    //datatable.clear();
                    //datatable.rows.add(splashArrayCustomerList);
                    datatable.draw();
                    $('#tblEmployeelist_filter .form-control-sm').trigger("input");
                    //$('#tblEmployeelist').dataTable().fnFilter(' ').draw(false);
                }, 500);
              }
            } else {
                $('#employeeListPOPModal').modal();
                setTimeout(function () {
                    $('#tblEmployeelist_filter .form-control-sm').focus();
                    $('#tblEmployeelist_filter .form-control-sm').val('');
                    $('#tblEmployeelist_filter .form-control-sm').trigger("input");
                    var datatable = $('#tblEmployeelist').DataTable();
                    //datatable.clear();
                    //datatable.rows.add(splashArrayCustomerList);
                    datatable.draw();
                    $('#tblEmployeelist_filter .form-control-sm').trigger("input");
                    //$('#tblEmployeelist').dataTable().fnFilter(' ').draw(false);
                }, 500);
            }
        }

    });

    $(document).on("click", "#tblEmployeelist tbody tr", function (e) {
        let employeeName = $(this).find(".colEmployeeName").text() || '';
        let employeeID = $(this).find(".colID").text() || '';
        $('#sltEmployeeName').val(employeeName);
        $('#mytag').val(employeeID);

        if(employeeID){
          $('.fullScreenSpin').css('display','inline-block');
            templateObject.accessgrouprecord.set('');
            getTableData(employeeID);

        }else{
            getTableData('All');
        }

        $('.employeeNameHead span').text(employeeName);

        // $('#tblEmployeelist').val(employeeName);
        $('#employeeListPOPModal').modal('toggle');
    });

});
Template.registerHelper('equals', function (a, b) {
    return a === b;
});
Template.registerHelper('notEquals', function (a, b) {
    return a != b;
});
Template.accessleveldup.helpers({
    records: () => {
        return Template.instance().records.get();
    },
    recordsaccess: () => {
        return Template.instance().recordsaccess.get();
    },
    accesslevelrecord: () => {
        return Template.instance().accesslevelrecord.get().sort(function (a, b) {
            if (a.description.toLowerCase() == 'NA') {
                return 1;
            }
            else if (b.description.toLowerCase() == 'NA') {
                return -1;
            }
            return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
        });
    },
    erpAccessLevelRecord: () => {
        return Template.instance().erpAccessLevelRecord.get().sort(function (a, b) {
            if (a.description.toLowerCase() == 'NA') {
                return 1;
            }
            else if (b.description.toLowerCase() == 'NA') {
                return -1;
            }
            return (a.description.toLowerCase() > b.description.toLowerCase()) ? 1 : -1;
        });
    },
    employeeID: () => {
        return Template.instance().employeeID.get();
    },
    employeename: () => {
        return Template.instance().employeename.get();
    },
    employeeformaccessrecord: () => {
        return Template.instance().employeeformaccessrecord.get();
    },
    isAccountsLicence: () => {
        return Session.get('CloudAccountsLicence');
    },
    employeerecords: () => {
        return Template.instance().employeerecords.get().sort(function(a, b){
            if (a.employeename == 'NA') {
                return 1;
            }
            else if (b.employeename == 'NA') {
                return -1;
            }
            return (a.employeename.toUpperCase() > b.employeename.toUpperCase()) ? 1 : -1;
        });
    },
    accessgrouprecord: () => {
        return Template.instance().accessgrouprecord.get();
    }
});

Template.registerHelper('arrayify',function(obj){
    var result = [];
    for (var key in obj) result.push({name:key,value:obj[key]});
    return result.sort(function(a, b){
        if (a.name == 'NA') {
            return 1;
        }
        else if (b.name == 'NA') {
            return -1;
        }
        return (a.name.toUpperCase() > b.name.toUpperCase()) ? 1 : -1;
    });
});

Template.accessleveldup.events({
    'click .employee-img': function (event) {
        let templateObject = Template.instance();
        let tempInstance = Template.instance();
        templateObject.$("#STEmployeeName").trigger("focus");

    },
    'change #sltEmploy22222eeName': function (event) {
        let templateObject = Template.instance();
        let employeeName = $(event.target).val();
        let employeeID = $('option:selected', event.target).attr('mytag');


        if(employeeID){
            templateObject.accessgrouprecord.set('');
            templateObject.getTableData(employeeID);

        }


    },
    'click .inactiveLicence': function (event) {

        var targetID = '';
        var $cell= $(event.target).closest('td');
        var targetID = $(event.target).closest('tr').attr('id');

        /* Lincence Check for Menu Options */
        let isFixedAssetsLicence = Session.get('CloudFixedAssetsLicence');
        let isInventoryLicence = Session.get('CloudInventoryLicence');
        let isManufacturingLicence = Session.get('CloudManufacturingLicence');
        let isPurchasesLicence = Session.get('CloudPurchasesLicence');
        let isSalesLicence = Session.get('CloudSalesLicence');
        let isShippingLicence = Session.get('CloudShippingLicence');
        let isStockTakeLicence = Session.get('CloudStockTakeLicence');
        let isStockTransferLicence = Session.get('CloudStockTransferLicence');
        let isMainLicence = Session.get('CloudMainLicence');
        let isDashboardLicence = Session.get('CloudDashboardLicence');

        /*Licence Check Menu to add */
        let isAccountsLicence = Session.get('CloudAccountsLicence');
        let isContactsLicence = Session.get('CloudContactsLicence');
        let isExpenseClaimsLicence = Session.get('CloudExpenseClaimsLicence');
        let isPaymentsLicence = Session.get('CloudPaymentsLicence');
        let isReportsLicence = Session.get('CloudReportsLicence');
        let isSettingsLicence = Session.get('CloudSettingsLicence');

        let accessDesc = $("#"+targetID+"_accessDesc").val();
        $('.upgModule').html(accessDesc);
        $('#upgradeModal').modal('toggle');


    },
    'click #tblAccessLevel tbody tr td': function (event) {

        var targetID = '';
        var $cell= $(event.target).closest('td');

        if($cell.index() != 0){
            if((event.target.name !== '') && (event.target.name !== undefined)){
                targetID = event.target.name;







                if($cell.index() == 1){
                    $("."+targetID+"_noaccess").css('opacity','1');
                    $("."+targetID+"_readonly").css('opacity','1');
                    $("."+targetID+"_createandread").css('opacity','1');
                    $("."+targetID+"_fullwithoutdelete").css('opacity','1');
                    $("."+targetID+"_fullwithdelete").css('opacity','1');
                }else if($cell.index() == 2){
                    $("."+targetID+"_noaccess").css('opacity','0');
                    $("."+targetID+"_readonly").css('opacity','1');
                    $("."+targetID+"_createandread").css('opacity','1');
                    $("."+targetID+"_fullwithoutdelete").css('opacity','1');
                    $("."+targetID+"_fullwithdelete").css('opacity','1');
                }

            }

        }

    }
});

Template.accessleveldup.events({
    'click #refreshpagelist': function(event){
        $('.fullScreenSpin').css('display','inline-block');
        localStorage.setItem('VS1TERPFormList', '');
        Meteor._reload.reload();
        let templateObject = Template.instance();
        let loggedEmpID = Session.get('mySessionEmployeeLoggedID');
        if((loggedEmpID) && (loggedEmpID !== null)){
            setTimeout(function () {
                localStorage.setItem('VS1AccessLevelList', '');
                templateObject.getTableData();
            },1000);
            templateObject.employeeID.set(loggedEmpID);
        }else{
            $('.fullScreenSpin').css('display','none');
        }
    },
    'click .btnRefresh': function () {
        Meteor._reload.reload();
    },
    'click .chkSettings': function (event) {

        if($(event.target).is(':checked')){
            $(event.target).val(1);
        }else{
            $(event.target).val(6);
        }
    },
    'click .formCheckEnableAll': function (event) {

        if($(event.target).is(':checked')){
           $('.chkGlobalSettings').prop("checked", true);
            $('.tbl_access .chkSettings').prop("checked", true);
            $('.tbl_access .chkSettings').val(1);
            $('.tbl_access .chkLaunchAppointment').prop("checked", false);
            $('.tbl_access .chkLaunchAppointment').val(6);
        }else{
            $('.chkGlobalSettings').prop("checked", false);
            $('.tbl_access .chkSettings').prop("checked", false);
            $('.tbl_access .chkSettings').val(6);
        }
    },
    'click .chkGlobalSettings': function (event) {
         let getCheckedValue = $(event.target).val();
         let getSelectID = '.tbl_access .chkSettings'+getCheckedValue;
        if($(event.target).is(':checked')){
          if(getCheckedValue == 'Appointments'){
            $('.tbl_access .chkSetting' + getCheckedValue + '').prop("checked", true);
            $('.tbl_access .chkSetting' + getCheckedValue + '').val(1);

            $('.tbl_access .chkLaunchAppointment').prop("checked", false);
            $('.tbl_access .chkLaunchAppointment').val(6);
          }else{
            $('.tbl_access .chkSetting' + getCheckedValue + '').prop("checked", true);
            $('.tbl_access .chkSetting' + getCheckedValue + '').val(1);
          }

        }else{
            $('.tbl_access .chkSetting' + getCheckedValue + '').prop("checked", false);
            $('.tbl_access .chkSetting' + getCheckedValue + '').val(6);
        }
    },
    'click .employeeModules .chkSettingAccounts': function (event) {
         if($(event.target).is(':checked')){
           if($('.chkGlobalSettings#formCheck-Accounts').is(':checked')){

          }else{
            $('.chkGlobalSettings#formCheck-Accounts').trigger("click");
          }
        }
    },
    'click .employeeModules .chkSettingAppointments': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Appointments').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Appointments').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingEmployee': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Employee').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Employee').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingGeneral': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-General').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-General').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingInventory': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Inventory').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Inventory').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingManufacturing': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Manufacturing').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Manufacturing').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingPayments': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Payments').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Payments').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingPayroll': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Payroll').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Payroll').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingPurchases': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Purchases').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Purchases').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingSales': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Sales').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Sales').trigger("click");
         }
       }
    },
    'click .employeeModules .chkSettingShipping': function (event) {
        if($(event.target).is(':checked')){
          if($('.chkGlobalSettings#formCheck-Shipping').is(':checked')){

         }else{
           $('.chkGlobalSettings#formCheck-Shipping').trigger("click");
         }
       }
    },
    'click .chkSettings.chkInventory': function (event) {

        if($(event.target).is(':checked')){

            swal('PLEASE NOTE', 'If Inventory tracking is turned on it cannot be disabled in the future.', 'info');
        }else{

        }
    },
    'click .chkSettings.chkOnlyQtySales':async function (event) {

        let accesslevelService = new AccessLevelService();
        if($(event.target).is(':checked')){
            let checkBOQtyData = await accesslevelService.getCheckBOInvoiceList();
            if(checkBOQtyData.BackOrderSalesList.length > 0){
                swal('PLEASE NOTE', 'You can not turn on this feature if you have active Back Orders.', 'info');
                $('.chkSettings.chkOnlyQtySales').prop( "checked", false );
                $('.chkSettings.chkOnlyQtyPO').prop( "checked", false );
            }
        }else{

        }
    },
    'click .chkSettings.chkOnlyQtyPO':async function (event) {

        let accesslevelService = new AccessLevelService();
        if($(event.target).is(':checked')){
            let checkBOQtyData = await accesslevelService.getCheckBOPOList();
            if(checkBOQtyData.tpurchaseorderbackorder.length > 0){
                swal('PLEASE NOTE', 'You can not turn on this feature if you have active Back Orders.', 'info');
                $('.chkSettings.chkOnlyQtyPO').prop( "checked", false );
                $('.chkSettings.chkOnlyQtySales').prop( "checked", false );
            }

        }else{

        }
    },
    'click .chkSettings.chkLaunchAllocation': function (event) {

        if($(event.target).is(':checked')){

            $('.chkSettings.chkLaunchAppointment').prop( "checked", false );
            $('.tbl_access .chkLaunchAppointment').val(6);
        }else{

        }
    },
    'click .chkSettings.chkLaunchAppointment': function (event) {

        if($(event.target).is(':checked')){

            $('.chkSettings.chkLaunchAllocation').prop( "checked", false );
            $('.tbl_access .chkLaunchAllocation').val(6);
        }else{

        }
    },
    'click .btnGlobalSave': function () {
        let templateObject = Template.instance();
        let accesslevelService = new AccessLevelService();

        let empInputValue = templateObject.$("#sltEmployeeName").val()||'';
        var erpGet = erpDb();
        if(empInputValue != ''){
        if(empInputValue === "All"){
            let lineItemsFormAccess = [];
            let lineItemObjFormAccess = {};
            $('.fullScreenSpin').css('display','inline-block');
            $('.tblAccessLevel > tbody > tr').each(function(){
                var $tblrow = $(this);
                var lineID = this.id;

                var radioValue = $("input:checkbox[name='"+lineID+"']").val();
                var radioValueCheck = $("input[name='"+lineID+"']:checked").val();
                let accessDesc = $("#"+lineID+"_accessDesc").val();
                let accessInitialValue = $("#"+lineID+"_accessInit").val();

                var tableID = $(this).attr('name');
                let accessNumber = 6;
                if(radioValue == 1){
                    accessNumber = 1;
                }else{
                    accessNumber =6;
                }

                lineItemObjFormAccess = {
                    EmployeeId : 0,
                    formID:parseInt(this.id)|| '',
                    Access : accessNumber,
                };

                lineItemsFormAccess.push(lineItemObjFormAccess);


            });
            /*Test Start HERE*/
            let objDetailsAccess = {
                Name: "VS1_EmployeeAccess",
                Params: {
                    VS1EmployeeAccessList:lineItemsFormAccess
                    // VS1EmployeeAccessList:
                    // [
                    //     {
                    //         EmployeeId:0,
                    //         formID:0,
                    //         Access:1
                    //     }
                    // ]
                }
            };


            var oPost = new XMLHttpRequest();

            oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_EmployeeAccess"', true);
            oPost.setRequestHeader("database",erpGet.ERPDatabase);
            oPost.setRequestHeader("username",erpGet.ERPUsername);
            oPost.setRequestHeader("password",erpGet.ERPPassword);
            oPost.setRequestHeader("Accept", "application/json");
            oPost.setRequestHeader("Accept", "application/html");
            oPost.setRequestHeader("Content-type", "application/json");
            var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsAccess);
            oPost.send(myString);
            oPost.onreadystatechange = function() {
                if(oPost.readyState == 4 && oPost.status == 200) {
                    $('.fullScreenSpin').css('display','none');
                    swal({
                        title: 'Settings Successly Saved',
                        text: "Please log out to activate your changes.",
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            let getLasTDatabase = erpGet.ERPDatabase;
                            if(getLasTDatabase){
                                deleteStoreDatabase(getLasTDatabase).then(function(data) {
                                    window.open('/','_self');
                                }).catch(function (err) {
                                    window.open('/','_self');
                                });
                            }else{
                                window.open('/','_self');
                            }
                        } else if (result.dismiss === 'cancel') {

                        }
                    });

                }else if(oPost.readyState == 4 && oPost.status == 403){
                    $('.fullScreenSpin').css('display','none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                }else if(oPost.readyState == 4 && oPost.status == 406){
                    $('.fullScreenSpin').css('display','none');
                    var ErrorResponse = oPost.getResponseHeader('errormessage');
                    var segError = ErrorResponse.split(':');

                    if((segError[1]) == ' "Unable to lock object'){

                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }else{
                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }

                }else if(oPost.readyState == '') {
                    $('.fullScreenSpin').css('display','none');
                    swal({
                        title: 'Oooops...',
                        text: oPost.getResponseHeader('errormessage'),
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                        } else if (result.dismiss === 'cancel') {

                        }
                    });
                }
            }
            /*Test End HERE*/
        }else{

            let employeeID = $("#mytag").val()||'';


            var loggedEmpName = localStorage.getItem('mySession');
            let empLoggedID = Session.get('mySessionEmployeeLoggedID');
            let isSidePanelID = '';
            let isTopPanelID = '';

            /* Lincence Check for Menu Options */
            let isFixedAssetsLicence = Session.get('CloudFixedAssetsLicence');
            let isInventoryLicence = Session.get('CloudInventoryLicence');
            let isManufacturingLicence = Session.get('CloudManufacturingLicence');
            let isPurchasesLicence = Session.get('CloudPurchasesLicence');
            let isSalesLicence = Session.get('CloudSalesLicence');
            let isShippingLicence = Session.get('CloudShippingLicence');
            let isStockTakeLicence = Session.get('CloudStockTakeLicence');
            let isStockTransferLicence = Session.get('CloudStockTransferLicence');
            let isMainLicence = Session.get('CloudMainLicence');
            let isDashboardLicence = Session.get('CloudDashboardLicence');

            /*Licence Check Menu to add */
            let isAccountsLicence = Session.get('CloudAccountsLicence');
            let isContactsLicence = Session.get('CloudContactsLicence');
            let isExpenseClaimsLicence = Session.get('CloudExpenseClaimsLicence');
            let isPaymentsLicence = Session.get('CloudPaymentsLicence');
            let isReportsLicence = Session.get('CloudReportsLicence');
            let isSettingsLicence = Session.get('CloudSettingsLicence');
            /*End Licence Check Menu to add */
            /* End Licence Check for menu option */
            let lineItemsFormAccess = [];
            let lineItemObjFormAccess = {};

            if(employeeID){
                $('.fullScreenSpin').css('display','inline-block');
                $('.tblAccessLevel > tbody > tr').each(function(){
                    var $tblrow = $(this);
                    var lineID = this.id;

                    var radioValue = $("input:checkbox[name='"+lineID+"']").val();
                    var radioValueCheck = $("input[name='"+lineID+"']:checked").val();
                    let accessDesc = $("#"+lineID+"_accessDesc").val();
                    let accessInitialValue = $("#"+lineID+"_accessInit").val();

                    var tableID = $(this).attr('name');
                    let accessNumber = 6;
                    if(radioValue == 1){
                        accessNumber = 1;
                    }else{
                        accessNumber =6;
                    }

                    lineItemObjFormAccess = {
                        EmployeeId : parseInt(employeeID) || '',
                        formID:parseInt(this.id)|| '',
                        Access : accessNumber,
                    };

                    lineItemsFormAccess.push(lineItemObjFormAccess);


                });

                let objDetailsAccess = {
                    Name: "VS1_EmployeeAccess",
                    Params: {
                        VS1EmployeeAccessList:lineItemsFormAccess
                    }
                };

                var oPost = new XMLHttpRequest();

                oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_EmployeeAccess"', true);
                oPost.setRequestHeader("database",erpGet.ERPDatabase);
                oPost.setRequestHeader("username",erpGet.ERPUsername);
                oPost.setRequestHeader("password",erpGet.ERPPassword);
                oPost.setRequestHeader("Accept", "application/json");
                oPost.setRequestHeader("Accept", "application/html");
                oPost.setRequestHeader("Content-type", "application/json");
                var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsAccess);
                oPost.send(myString);
                oPost.onreadystatechange = function() {
                    if(oPost.readyState == 4 && oPost.status == 200) {
                        $('.fullScreenSpin').css('display','none');
                        if((employeeID == empLoggedID) ){
                            swal({
                                title: 'Settings Successly Saved',
                                text: "Please log out to activate your changes.",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    let getLasTDatabase = erpGet.ERPDatabase;
                                    if(getLasTDatabase){
                                        deleteStoreDatabase(getLasTDatabase).then(function(data) {
                                            window.open('/','_self');
                                        }).catch(function (err) {
                                            window.open('/','_self');
                                        });
                                    }else{
                                        window.open('/','_self');
                                    }
                                } else if (result.dismiss === 'cancel') {

                                }
                            });
                        }else{
                            swal('Settings Successly Saved', '', 'success');
                        }
                    }else if(oPost.readyState == 4 && oPost.status == 403){
                        $('.fullScreenSpin').css('display','none');
                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }else if(oPost.readyState == 4 && oPost.status == 406){
                        $('.fullScreenSpin').css('display','none');
                        var ErrorResponse = oPost.getResponseHeader('errormessage');
                        var segError = ErrorResponse.split(':');

                        if((segError[1]) == ' "Unable to lock object'){

                            swal({
                                title: 'Oooops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                } else if (result.dismiss === 'cancel') {

                                }
                            });
                        }else{
                            swal({
                                title: 'Oooops...',
                                text: oPost.getResponseHeader('errormessage'),
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                } else if (result.dismiss === 'cancel') {

                                }
                            });
                        }

                    }else if(oPost.readyState == '') {
                        $('.fullScreenSpin').css('display','none');
                        swal({
                            title: 'Oooops...',
                            text: oPost.getResponseHeader('errormessage'),
                            type: 'error',
                            showCancelButton: false,
                            confirmButtonText: 'Try Again'
                        }).then((result) => {
                            if (result.value) {
                            } else if (result.dismiss === 'cancel') {

                            }
                        });
                    }
                }
                /*Test End HERE*/


            }

            setTimeout(function () {
                $('.fullScreenSpin').css('display','none');
            }, 5000);

        }
        }else{
          $('.fullScreenSpin').css('display','none');
          swal('Employee has not been selected!', '', 'warning');
          event.preventDefault();

        }
    },
    'click .btnTopGlobalSaveUpdate-Ras': function () {
        swal({
            title: 'Do you want to save both VS1 and Employee Modules?',
            text: 'Yes to Save Both and No to Save only the VS1 Modules.',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                $(".btnGlobalSave").trigger("click");
            } else if (result.dismiss === 'cancel') {

            }
        })
    },
    'click .btnSaveAccess': function () {
        let templateObject = Template.instance();
        let accesslevelService = new AccessLevelService();

        let empInputValue = templateObject.$("#sltEmployeeName").val();


        let employeeID = $("#mytag").val()||'';


        var loggedEmpName = localStorage.getItem('mySession');
        let empLoggedID = Session.get('mySessionEmployeeLoggedID');
        let isSidePanelID = '';
        let isTopPanelID = '';

        /* Lincence Check for Menu Options */
        let isFixedAssetsLicence = Session.get('CloudFixedAssetsLicence');
        let isInventoryLicence = Session.get('CloudInventoryLicence');
        let isManufacturingLicence = Session.get('CloudManufacturingLicence');
        let isPurchasesLicence = Session.get('CloudPurchasesLicence');
        let isSalesLicence = Session.get('CloudSalesLicence');
        let isShippingLicence = Session.get('CloudShippingLicence');
        let isStockTakeLicence = Session.get('CloudStockTakeLicence');
        let isStockTransferLicence = Session.get('CloudStockTransferLicence');
        let isMainLicence = Session.get('CloudMainLicence');
        let isDashboardLicence = Session.get('CloudDashboardLicence');

        /*Licence Check Menu to add */
        let isAccountsLicence = Session.get('CloudAccountsLicence');
        let isContactsLicence = Session.get('CloudContactsLicence');
        let isExpenseClaimsLicence = Session.get('CloudExpenseClaimsLicence');
        let isPaymentsLicence = Session.get('CloudPaymentsLicence');
        let isReportsLicence = Session.get('CloudReportsLicence');
        let isSettingsLicence = Session.get('CloudSettingsLicence');
        /*End Licence Check Menu to add */
        /* End Licence Check for menu option */

        if(employeeID){
            $('.fullScreenSpin').css('display','inline-block');
            $('.tblAccessLevel > tbody > tr').each(function(){
                var $tblrow = $(this);
                var lineID = this.id;

                var radioValue = $("input:checkbox[name='"+lineID+"']").val();
                var radioValueCheck = $("input[name='"+lineID+"']:checked").val();
                let accessDesc = $("#"+lineID+"_accessDesc").val();
                let accessInitialValue = $("#"+lineID+"_accessInit").val();
                if(radioValue != accessInitialValue){
                    if(radioValue){
                        var tableID = $(this).attr('name');
                        let data = {
                            type: "TEmployeeFormAccess",
                            fields: {
                                ID : tableID,
                                EmployeeId : employeeID,
                                AccessLevel : radioValue,
                                FormId:this.id
                            }
                        };
                        accesslevelService.saveEmpAccess(data).then(function (data) {
                            if((employeeID == empLoggedID) ){
                                if((radioValue == 1) && (accessDesc == "Print Delivery Docket")){
                                    isDocket = true;
                                    Session.setPersistent('CloudPrintDeliveryDocket', isDocket);
                                }else if((radioValue != 1) && (accessDesc == "Print Delivery Docket")){
                                    isDocket = false;
                                    Session.setPersistent('CloudPrintDeliveryDocket', isDocket);
                                }

                                if((radioValue == 1) && (accessDesc == "Print Invoice")){
                                    isInvoice = true;
                                    Session.setPersistent('CloudPrintInvoice', isInvoice);
                                }else if((radioValue != 1) && (accessDesc == "Print Invoice")){
                                    isInvoice = false;
                                    Session.setPersistent('CloudPrintInvoice', isInvoice);
                                }

                                if((radioValue == 1) && (accessDesc == "User Password Details")){
                                    isUserPassDetail = true;
                                    Session.setPersistent('CloudUserPass', isUserPassDetail);
                                }else if((radioValue != 1) && (accessDesc == "User Password Details")){
                                    isUserPassDetail = false;
                                    Session.setPersistent('CloudUserPass', isUserPassDetail);
                                }

                                if((radioValue == 1) && (accessDesc == "View Dockets")){
                                    isViewDockets = true;
                                    Session.setPersistent('CloudViewDockets', isViewDockets);
                                }else if((radioValue != 1) && (accessDesc == "View Dockets")){
                                    isViewDockets = false;
                                    Session.setPersistent('CloudViewDockets', isViewDockets);
                                }

                                if((radioValue == 1) && (accessDesc == "Qty Only on Purchase Order")){
                                    isPurchaseQtyOnly = true;
                                    Session.setPersistent('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                                }else if((radioValue != 1) && (accessDesc == "Qty Only on Purchase Order")){
                                    isPurchaseQtyOnly = false;
                                    Session.setPersistent('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                                }

                                if((radioValue == 1) && (accessDesc == "Qty Only on Sales")){
                                    isSalesQtyOnly = true;
                                    Session.setPersistent('CloudSalesQtyOnly', isSalesQtyOnly);
                                }else if((radioValue != 1) && (accessDesc == "Qty Only on Sales")){
                                    isSalesQtyOnly = false;
                                    Session.setPersistent('CloudSalesQtyOnly', isSalesQtyOnly);
                                }

                                if((radioValue == 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                                    isDashboard = true;
                                    Session.setPersistent('CloudDashboardModule', isDashboard);
                                }else if((radioValue != 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                                    isDashboard = false;
                                    Session.setPersistent('CloudDashboardModule', isDashboard);
                                }









                                if((radioValue == 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                                    isInventory = true;
                                    Session.setPersistent('CloudInventoryModule', isInventory);
                                }else if((radioValue != 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                                    isInventory = false;
                                    Session.setPersistent('CloudInventoryModule', isInventory);
                                }

                                if((radioValue == 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                                    isManufacturing = true;
                                    Session.setPersistent('CloudManufacturingModule', isManufacturing);
                                }else if((radioValue != 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                                    isManufacturing = false;
                                    Session.setPersistent('CloudManufacturingModule', isManufacturing);
                                }

                                if((radioValue == 1) && (accessDesc == "Settings")){
                                    isAccessLevels = true;
                                    Session.setPersistent('CloudAccessLevelsModule', isAccessLevels);
                                }else if((radioValue != 1) && (accessDesc == "Settings")){
                                    isAccessLevels = false;
                                    Session.setPersistent('CloudAccessLevelsModule', isAccessLevels);
                                }

                                if((radioValue == 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                                    isShipping = true;
                                    Session.setPersistent('CloudShippingModule', isShipping);
                                }else if((radioValue != 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                                    isShipping = false;
                                    Session.setPersistent('CloudShippingModule', isShipping);
                                }

                                if((radioValue == 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                                    isStockTransfer = true;
                                    Session.setPersistent('CloudStockTransferModule', isStockTransfer);
                                }else if((radioValue != 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                                    isStockTransfer = false;
                                    Session.setPersistent('CloudStockTransferModule', isStockTransfer);
                                }

                                if((radioValue == 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                                    isStockTake = true;
                                    Session.setPersistent('CloudStockTakeModule', isStockTake);
                                }else if((radioValue != 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                                    isStockTake = false;
                                    Session.setPersistent('CloudStockTakeModule', isStockTake);
                                }
                                if((radioValue == 1) && (accessDesc == "Sales") && (isSalesLicence)){
                                    isSales = true;
                                    Session.setPersistent('CloudSalesModule', isSales);
                                }else if((radioValue != 1) && (accessDesc == "Sales") && (isSalesLicence)){
                                    isSales = false;
                                    Session.setPersistent('CloudSalesModule', isSales);
                                }
                                if((radioValue == 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                                    isPurchases = true;
                                    Session.setPersistent('CloudPurchasesModule', isPurchases);
                                }else if((radioValue != 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                                    isPurchases = false;
                                    Session.setPersistent('CloudPurchasesModule', isPurchases);
                                }
                                if((radioValue == 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                                    isExpenseClaims = true;
                                    Session.setPersistent('CloudExpenseClaimsModule', isExpenseClaims);
                                }else if((radioValue != 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                                    isExpenseClaims = false;
                                    Session.setPersistent('CloudExpenseClaimsModule', isExpenseClaims);
                                }
                                if((radioValue == 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                                    isFixedAssets = true;
                                    Session.setPersistent('CloudFixedAssetsModule', isFixedAssets);
                                }else if((radioValue != 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                                    isFixedAssets = false;
                                    Session.setPersistent('CloudFixedAssetsModule', isFixedAssets);
                                }
                                if((radioValue == 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                                    isPayments = true;
                                    Session.setPersistent('CloudPaymentsModule', isPayments);
                                }else if((radioValue != 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                                    isPayments = false;
                                    Session.setPersistent('CloudPaymentsModule', isPayments);
                                }
                                if((radioValue == 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                                    isContacts = true;
                                    Session.setPersistent('CloudContactsModule', isContacts);
                                }else if((radioValue != 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                                    isContacts = false;
                                    Session.setPersistent('CloudContactsModule', isContacts);
                                }
                                if((radioValue == 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                                    isAccounts = true;
                                    Session.setPersistent('CloudAccountsModule', isAccounts);
                                }else if((radioValue != 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                                    isAccounts = false;
                                    Session.setPersistent('CloudAccountsModule', isAccounts);
                                }
                                if((radioValue == 1) && (accessDesc == "Reports") && (isReportsLicence)){
                                    isReports = true;
                                    Session.setPersistent('CloudReportsModule', isReports);
                                }else if((radioValue != 1) && (accessDesc == "Reports") && (isReportsLicence)){
                                    isReports = false;
                                    Session.setPersistent('CloudReportsModule', isReports);
                                }
                                if((radioValue == 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                                    isSettings = true;
                                    Session.setPersistent('CloudSettingsModule', isSettings);
                                }else if((radioValue != 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                                    isSettings = false;
                                    Session.setPersistent('CloudSettingsModule', isSettings);
                                }

                            }
                        }).catch(function (err) {
                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {

                                }
                            });
                            $('.fullScreenSpin').css('display','none');
                        });

                    }else{
                        let data = {
                            type: "TEmployeeFormAccess",
                            fields: {
                                EmployeeId : employeeID,
                                AccessLevel : radioValue,
                                FormId:this.id
                            }
                        };
                        accesslevelService.saveEmpAccess(data).then(function (data) {
                            if((employeeID == empLoggedID) ){
                                if((radioValue == 1) && (accessDesc == "Print Delivery Docket")){
                                    isDocket = true;
                                    Session.setPersistent('CloudPrintDeliveryDocket', isDocket);
                                }else if((radioValue != 1) && (accessDesc == "Print Delivery Docket")){
                                    isDocket = false;
                                    Session.setPersistent('CloudPrintDeliveryDocket', isDocket);
                                }

                                if((radioValue == 1) && (accessDesc == "Print Invoice")){
                                    isInvoice = true;
                                    Session.setPersistent('CloudPrintInvoice', isInvoice);
                                }else if((radioValue != 1) && (accessDesc == "Print Invoice")){
                                    isInvoice = false;
                                    Session.setPersistent('CloudPrintInvoice', isInvoice);
                                }

                                if((radioValue == 1) && (accessDesc == "User Password Details")){
                                    isUserPassDetail = true;
                                    Session.setPersistent('CloudUserPass', isUserPassDetail);
                                }else if((radioValue != 1) && (accessDesc == "User Password Details")){
                                    isUserPassDetail = false;
                                    Session.setPersistent('CloudUserPass', isUserPassDetail);
                                }

                                if((radioValue == 1) && (accessDesc == "View Dockets")){
                                    isViewDockets = true;
                                    Session.setPersistent('CloudViewDockets', isViewDockets);
                                }else if((radioValue != 1) && (accessDesc == "View Dockets")){
                                    isViewDockets = false;
                                    Session.setPersistent('CloudViewDockets', isViewDockets);
                                }

                                if((radioValue == 1) && (accessDesc == "Qty Only on Purchase Order")){
                                    isPurchaseQtyOnly = true;
                                    Session.setPersistent('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                                }else if((radioValue != 1) && (accessDesc == "Qty Only on Purchase Order")){
                                    isPurchaseQtyOnly = false;
                                    Session.setPersistent('CloudPurchaseQtyOnly', isPurchaseQtyOnly);
                                }

                                if((radioValue == 1) && (accessDesc == "Qty Only on Sales")){
                                    isSalesQtyOnly = true;
                                    Session.setPersistent('CloudSalesQtyOnly', isSalesQtyOnly);
                                }else if((radioValue != 1) && (accessDesc == "Qty Only on Sales")){
                                    isSalesQtyOnly = false;
                                    Session.setPersistent('CloudSalesQtyOnly', isSalesQtyOnly);
                                }

                                if((radioValue == 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                                    isDashboard = true;
                                    Session.setPersistent('CloudDashboardModule', isDashboard);
                                }else if((radioValue != 1) && (accessDesc == "Dashboard") && (isDashboardLicence)){
                                    isDashboard = false;
                                    Session.setPersistent('CloudDashboardModule', isDashboard);
                                }



                                if((radioValue == 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                                    isInventory = true;
                                    Session.setPersistent('CloudInventoryModule', isInventory);
                                }else if((radioValue != 1) && (accessDesc == "Inventory" || accessDesc == "Inventory Tracking") && (isInventoryLicence)){
                                    isInventory = false;
                                    Session.setPersistent('CloudInventoryModule', isInventory);
                                }

                                if((radioValue == 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                                    isManufacturing = true;
                                    Session.setPersistent('CloudManufacturingModule', isManufacturing);
                                }else if((radioValue != 1) && (accessDesc == "Manufacturing") && (isManufacturingLicence)){
                                    isManufacturing = false;
                                    Session.setPersistent('CloudManufacturingModule', isManufacturing);
                                }

                                if((radioValue == 1) && (accessDesc == "Settings")){
                                    isAccessLevels = true;
                                    Session.setPersistent('CloudAccessLevelsModule', isAccessLevels);
                                }else if((radioValue != 1) && (accessDesc == "Settings")){
                                    isAccessLevels = false;
                                    Session.setPersistent('CloudAccessLevelsModule', isAccessLevels);
                                }

                                if((radioValue == 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                                    isShipping = true;
                                    Session.setPersistent('CloudShippingModule', isShipping);
                                }else if((radioValue != 1) && (accessDesc == "Shipping") && (isShippingLicence)){
                                    isShipping = false;
                                    Session.setPersistent('CloudShippingModule', isShipping);
                                }

                                if((radioValue == 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                                    isStockTransfer = true;
                                    Session.setPersistent('CloudStockTransferModule', isStockTransfer);
                                }else if((radioValue != 1) && (accessDesc == "Stock Transfer") && (isStockTransferLicence)){
                                    isStockTransfer = false;
                                    Session.setPersistent('CloudStockTransferModule', isStockTransfer);
                                }

                                if((radioValue == 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                                    isStockTake = true;
                                    Session.setPersistent('CloudStockTakeModule', isStockTake);
                                }else if((radioValue != 1) && (accessDesc == "Stock Take") && (isStockTakeLicence)){
                                    isStockTake = false;
                                    Session.setPersistent('CloudStockTakeModule', isStockTake);
                                }
                                if((radioValue == 1) && (accessDesc == "Sales") && (isSalesLicence)){
                                    isSales = true;
                                    Session.setPersistent('CloudSalesModule', isSales);
                                }else if((radioValue != 1) && (accessDesc == "Sales") && (isSalesLicence)){
                                    isSales = false;
                                    Session.setPersistent('CloudSalesModule', isSales);
                                }
                                if((radioValue == 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                                    isPurchases = true;
                                    Session.setPersistent('CloudPurchasesModule', isPurchases);
                                }else if((radioValue != 1) && (accessDesc == "Purchases") && (isPurchasesLicence)){
                                    isPurchases = false;
                                    Session.setPersistent('CloudPurchasesModule', isPurchases);
                                }
                                if((radioValue == 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                                    isExpenseClaims = true;
                                    Session.setPersistent('CloudExpenseClaimsModule', isExpenseClaims);
                                }else if((radioValue != 1) && (accessDesc == "Expense Claims") && (isExpenseClaimsLicence)){
                                    isExpenseClaims = false;
                                    Session.setPersistent('CloudExpenseClaimsModule', isExpenseClaims);
                                }
                                if((radioValue == 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                                    isFixedAssets = true;
                                    Session.setPersistent('CloudFixedAssetsModule', isFixedAssets);
                                }else if((radioValue != 1) && (accessDesc == "Fixed Assets") && (isFixedAssetsLicence)){
                                    isFixedAssets = false;
                                    Session.setPersistent('CloudFixedAssetsModule', isFixedAssets);
                                }
                                if((radioValue == 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                                    isPayments = true;
                                    Session.setPersistent('CloudPaymentsModule', isPayments);
                                }else if((radioValue != 1) && (accessDesc == "Payments") && (isPaymentsLicence)){
                                    isPayments = false;
                                    Session.setPersistent('CloudPaymentsModule', isPayments);
                                }
                                if((radioValue == 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                                    isContacts = true;
                                    Session.setPersistent('CloudContactsModule', isContacts);
                                }else if((radioValue != 1) && (accessDesc == "Contacts") && (isContactsLicence)){
                                    isContacts = false;
                                    Session.setPersistent('CloudContactsModule', isContacts);
                                }
                                if((radioValue == 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                                    isAccounts = true;
                                    Session.setPersistent('CloudAccountsModule', isAccounts);
                                }else if((radioValue != 1) && (accessDesc == "Accounts") && (isAccountsLicence)){
                                    isAccounts = false;
                                    Session.setPersistent('CloudAccountsModule', isAccounts);
                                }
                                if((radioValue == 1) && (accessDesc == "Reports") && (isReportsLicence)){
                                    isReports = true;
                                    Session.setPersistent('CloudReportsModule', isReports);
                                }else if((radioValue != 1) && (accessDesc == "Reports") && (isReportsLicence)){
                                    isReports = false;
                                    Session.setPersistent('CloudReportsModule', isReports);
                                }
                                if((radioValue == 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                                    isSettings = true;
                                    Session.setPersistent('CloudSettingsModule', isSettings);
                                }else if((radioValue != 1) && (accessDesc == "Settings") && (isSettingsLicence)){
                                    isSettings = false;
                                    Session.setPersistent('CloudSettingsModule', isSettings);
                                }



                            }
                        }).catch(function (err) {

                            swal({
                                title: 'Oooops...',
                                text: err,
                                type: 'error',
                                showCancelButton: false,
                                confirmButtonText: 'Try Again'
                            }).then((result) => {
                                if (result.value) {
                                    Meteor._reload.reload();
                                } else if (result.dismiss === 'cancel') {

                                }
                            });
                            $('.fullScreenSpin').css('display','none');
                        });
                    }
                }

            });
        }

        setTimeout(function () {
            Meteor._reload.reload();
            $('.fullScreenSpin').css('display','none');
        }, 5000);
    },
    'click .inactiveLicence .chkSettings': function (event) {
        return false;
    },
    'click .btnBack':function(event){
        event.preventDefault();
        history.back(1);
    },
    'click .btnSelectAllEmployee':function(event){
         $('#sltEmployeeName').val('All');
         $('#employeeListPOPModal').modal('toggle');
    },
    'click .btnAddVS1User':function(event){
        swal({
            title: 'Is this an existing Employee?',
            text: '',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                swal("Please select the employee from the list below.", "", "info");
                $('#employeeListModal').modal('toggle');

            } else if (result.dismiss === 'cancel') {
                FlowRouter.go('/employeescard?addvs1user=true');
            }
        })
    },
    'click .essentialsdiv .chkSettings': function (event) {

        if($(event.target).is(':checked')){
            $(event.target).val(1);
            $('#upgradeModal').modal('toggle');
        }else{
            $(event.target).val(6);
        }
    },
    'click .plusdiv .chkSettings': function (event) {
        if($(event.target).is(':checked')){
            $(event.target).val(1);
            $('#upgradeModalPlus').modal('toggle');
        }else{
            $(event.target).val(6);
        }
    }
});
