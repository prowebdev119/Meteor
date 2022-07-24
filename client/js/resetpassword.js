import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';
import { Email } from 'meteor/email';
import "jquery-validation/dist/jquery.validate.min";
import '../lib/global/indexdbstorage.js';
Template.resetpassword.helpers({
    getUserEmail: function(){
      var url = FlowRouter.current().path;
      var getcustomer_email = url.split('?token=');
      var customer_email = getcustomer_email[getcustomer_email.length-1];
      if(customer_email){
       return ForgotPassword.find({emailToken: customer_email}).fetch();
    }
  }
});

Template.resetpassword.onCreated( () => {
   Template.instance().subscribe( 'RegisterUser' );
});

Template.resetpassword.onCreated(function(){
  const templateObject = Template.instance();
});
Template.resetpassword.onRendered(function(){

});

Template.resetpassword.events({
  'click #password-reset':function(event, template){
    event.preventDefault();
    let mailTo = $('#enteredEmail').val();
    let cloudpassword = $("#cloudEmpUserPassword").val();
    let confirmCloudpassword = $("#confirmCloudEmpUserPassword").val();

    if(cloudpassword.length < 8) {
      Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
      $('#cloudEmpUserPassword').css('border-color','red');
      $('#cloudEmpUserPassword').focus();

    }else{
      if((cloudpassword.match(/[A-z]/)) && (cloudpassword.match(/[A-Z]/)) && (cloudpassword.match(/\d/))){
        if(cloudpassword == confirmCloudpassword){
      $('#cloudEmpUserPassword').css('border-color','#b5b8bb #e2e4e7 #e8eaec #bdbfc3');
    $("form[name='formreset']").validate({
        rules: {
            cloudEmpLogonName: "required",
            cloudEmpEmailAddress: "required",
            cloudEmpUserPassword: "required"
        },
        messages: {
            cloudEmpLogonName: "This field can't be blank",
            cloudEmpEmailAddress: "This field can't be blank",
            cloudEmpUserPassword: "This field can't be blank"
        },
        submitHandler: function (form) {
        $('.fullScreenSpin').css('display','inline-block');
        var enteredEmail = $("#enteredEmail").val();
        var enteredPassword = $("#cloudEmpUserPassword").val();
        var cloudHashPassword = CryptoJS.MD5(enteredPassword).toString().toUpperCase();
        var oReq = new XMLHttpRequest();

        var oReqEmp = new XMLHttpRequest();

        oReq.open("GET",URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/' + 'erpapi/TVS1_ClientUsers?PropertyList="EmailId,Password,DatabaseName"&select=[EmailId]="'+enteredEmail+'"', true);
        oReq.setRequestHeader("database",vs1loggedDatatbase);
        oReq.setRequestHeader("username",'VS1_Cloud_Admin');
        oReq.setRequestHeader("password",'DptfGw83mFl1j&9');
        oReq.send();
        oReq.onreadystatechange = function() {
        if(oReq.readyState == 4 && oReq.status == 200) {
           var vs1Data = JSON.parse(oReq.responseText);
         if(vs1Data.tvs1_clientusers.length > 0){
           let customerPassword = vs1Data.tvs1_clientusers[0].Password || '';
           let empDatabase = vs1Data.tvs1_clientusers[0].DatabaseName || '';
           $('.fullScreenSpin').css('display','inline-block');
           let objDetailsUserPassword = {
               //JsonIn:{
               Name: "VS1_ChangePassword",
               Params: {
                   // FirstName: firstname,
                   // LastName: lastname,
                   //EmployeeName: $('#edtCustomerCompany').val(),
                   ERPLoginDetails:{
                   ERPUserName: enteredEmail,
                   // VS1Password: customerPassword,
                   NewPassword: enteredPassword
                 }
               }
               //}
           };

           var oPost = new XMLHttpRequest();
           oPost.open("POST", URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_ChangePassword"', true);
           oPost.setRequestHeader("database", vs1loggedDatatbase);
           oPost.setRequestHeader("username", 'VS1_Cloud_Admin');
           oPost.setRequestHeader("password", 'DptfGw83mFl1j&9');
           oPost.setRequestHeader("Accept", "application/json");
           oPost.setRequestHeader("Accept", "application/html");
           oPost.setRequestHeader("Content-type", "application/json");

           //var myString = '"JsonIn"' + ':' + JSON.stringify(objDetailsUser);
           var myStringUserPassword = '"JsonIn"' + ':' +JSON.stringify(objDetailsUserPassword);

           oPost.send(myStringUserPassword);

           oPost.onreadystatechange = function () {
               if (oPost.readyState == 4 && oPost.status == 200) {
                 var myArrResponse = JSON.parse(oPost.responseText);
                 if(myArrResponse.ProcessLog.ResponseNo == 401){
                   $('.fullScreenSpin').css('display','none');
                   swal('Oooops...', myArrResponse.ProcessLog.ResponseStatus, 'error');
                 }else{
                   getStoreToDelete(enteredEmail).then(function(data) {
                     window.open('/','_self');
                  }).catch(function (err) {
                    window.open('/','_self');
                  });

                 }
               } else if (oPost.readyState == 4 && oPost.status == 403) {
                   $('.fullScreenSpin').css('display', 'none');
                   swal({
                       title: 'Oooops...',
                       text: oPost.getResponseHeader('errormessage'),
                       type: 'error',
                       showCancelButton: false,
                       confirmButtonText: 'Try Again'
                   }).then((result) => {
                       if (result.value) {
                           Meteor._reload.reload();
                       } else if (result.dismiss === 'cancel') {
                           Meteor._reload.reload();
                       }
                   });
               } else if (oPost.readyState == 4 && oPost.status == 406) {
                   $('.fullScreenSpin').css('display', 'none');
                   var ErrorResponse = oPost.getResponseHeader('errormessage');
                   var segError = ErrorResponse.split(':');

                   if ((segError[1]) == ' "Unable to lock object') {

                       swal({
                           title: 'Oooops...',
                           text: oPost.getResponseHeader('errormessage'),
                           type: 'error',
                           showCancelButton: false,
                           confirmButtonText: 'Try Again'
                       }).then((result) => {
                           if (result.value) {
                               Meteor._reload.reload();
                           } else if (result.dismiss === 'cancel') {
                               Meteor._reload.reload();
                           }
                       });
                   } else {
                       swal({
                           title: 'Oooops...',
                           text: oPost.getResponseHeader('errormessage'),
                           type: 'error',
                           showCancelButton: false,
                           confirmButtonText: 'Try Again'
                       }).then((result) => {
                           if (result.value) {
                               Meteor._reload.reload();
                           } else if (result.dismiss === 'cancel') {
                               Meteor._reload.reload();
                           }
                       });
                   }

               } else if (oPost.readyState == '') {

                   swal({
                       title: 'Oooops...',
                       text: oPost.getResponseHeader('errormessage'),
                       type: 'error',
                       showCancelButton: false,
                       confirmButtonText: 'Try Again'
                   }).then((result) => {
                       if (result.value) {
                           Meteor._reload.reload();
                       } else if (result.dismiss === 'cancel') {
                           Meteor._reload.reload();
                       }
                   });
               }else{
                 $('.fullScreenSpin').css('display', 'none');
               }
           }

         }else{
           $('.fullScreenSpin').css('display','inline-block');
           Bert.alert('<strong>Error:</strong> Invalid Email, Email Not Found Please Try Again!', 'danger');
         }

     }else if(oReq.statusText == '') {
       swal({
         title: 'Ooops...',
         text: 'It seems we are unable to connect you to VS1 Cloud at the moment. Please try again in a few minutes.',
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
     }else if(oReq.readyState == 4 && oReq.status == 403){
       swal({
         title: 'Ooops...',
         text: 'It seems we are unable to connect you to VS1 Cloud at the moment. Please try again in a few minutes.',
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
     }else if(oReq.readyState == 4 && oReq.status == 406){
       swal({
         title: 'Oooops...',
         text: oReq.getResponseHeader('errormessage'),
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
     }else{
       $('.fullScreenSpin').css('display','none');
     }
     }

        }
    });
    $("form[name='formreset']").submit();

  }else{
    Bert.alert('<strong>Error: Confirm Password</strong> The Confirm Password confirmation does not match.', 'danger');
    $('#confirmCloudEmpUserPassword').css('border-color','red');
    $('#confirmCloudEmpUserPassword').focus();
  }
  } else {
      Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
      $('#cloudEmpUserPassword').css('border-color','red');
      $('#cloudEmpUserPassword').focus();
    }
  }
},
'click .backtoLogin':function(){
  window.open('/','_self');
}

});
