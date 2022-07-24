import { ReactiveVar } from 'meteor/reactive-var';
import {UtilityService} from "../utility-service";
let utilityService = new UtilityService();
Template.companyappsettings.onCreated(()=>{
  const templateObject = Template.instance();
  templateObject.recordscomp = new ReactiveVar();
  templateObject.recordscompaccess = new ReactiveVar();

  templateObject.simplestartArr = new ReactiveVar();
  templateObject.essentailsArr = new ReactiveVar();
  templateObject.plusArr = new ReactiveVar();
  templateObject.extraArr = new ReactiveVar();

  templateObject.employeecompaccess = new ReactiveVar();


});

Template.companyappsettings.events({
   'click #refreshpagelist': function(event){
     $('.fullScreenSpin').css('display','inline-block');
       Meteor._reload.reload();
   },
   'click .btnRefresh': function () {
     Meteor._reload.reload();
   },
   'click .essentialsdiv .chkSettings': function (event) {
     // Meteor._reload.reload();
     if($(event.target).is(':checked')){
       $(event.target).val(1);
       $('#upgradeModal').modal('toggle');
     }else{
       $(event.target).val(6);
     }
   },
   'click .plusdiv .chkSettings': function (event) {
     // Meteor._reload.reload();
     if($(event.target).is(':checked')){
       $(event.target).val(1);
       $('#upgradeModalPlus').modal('toggle');
     }else{
       $(event.target).val(6);
     }
   },
   'click .chkSettings.chkInventory': function (event) {
     // Meteor._reload.reload();
     if($(event.target).is(':checked')){
       //swal('Info', 'Please note if Inventory Tracking is turned on it cannot be turned off for a product in the future.', 'info');
       swal('PLEASE NOTE', 'If Inventory tracking is turned on it cannot be disabled in the future.', 'info');
     }else{
       //$(event.target).val(6);
     }
   },
   'click .btnBack':function(event){
     event.preventDefault();
     history.back(1);
   },
   'click .btnAddVS1User':function(event){
    //FlowRouter.go('/employeescard');
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
      // result.dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
      } else if (result.dismiss === 'cancel') {
        FlowRouter.go('/employeescard?addvs1user=true');
      }
    })
   },
   'click #formCheck-Essentials': function (event) {
     if($(event.target).is(':checked')){
       $('.essentialsdiv .custom-control-input').prop( "checked", true );
     }else{
       $('.essentialsdiv .custom-control-input').prop( "checked", false );
     }
   },
   'click #formCheck-Plus': function (event) {
     if($(event.target).is(':checked')){
       $('.plusdiv .custom-control-input').prop( "checked", true );
     }else{
       $('.plusdiv .custom-control-input').prop( "checked", false );
     }
   }

  });


  Template.registerHelper('equals', function (a, b) {
      return a === b;
  });
  Template.registerHelper('notEquals', function (a, b) {
      return a != b;
  });
  Template.companyappsettings.helpers({
      packagetype: () => {
        let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
          return cloudPackage;
      },
      simplestartArr : () => {
         return Template.instance().simplestartArr.get();
      },
      essentailsArr : () => {
         return Template.instance().essentailsArr.get();
      },
      plusArr : () => {
         return Template.instance().plusArr.get();
      },
      extraArr : () => {
         return Template.instance().extraArr.get().sort(function(a, b){
           if (a.moduleName == 'NA') {
         return 1;
             }
         else if (b.moduleName == 'NA') {
           return -1;
         }
       return (a.moduleName.toUpperCase() > b.moduleName.toUpperCase()) ? 1 : -1;
       });
      }
  });
