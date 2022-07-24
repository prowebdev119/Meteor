import { ReactiveVar } from 'meteor/reactive-var';
import {EmployeeProfileService} from './profile-service';
import { Random } from 'meteor/random';
import { Email } from 'meteor/email';
Template.forgotpassword.onCreated( () => {
   Template.instance().subscribe( 'RegisterUser' );
});
Template.forgotpassword.helpers({

});

Template.forgotpassword.onCreated(function(){
  const templateObject = Template.instance();
});

Template.forgotpassword.onRendered(function () {
  let getEmailData = '';

  if (FlowRouter.current().queryParams.checktoken) {
     getEmailData = FlowRouter.current().queryParams.checktoken || '';
      $("#email").val(getEmailData);
  }else{
    setTimeout(function(){
    $("#email").val(localStorage.getItem('usremail') || '');
    },500);
  }
});

Template.forgotpassword.events({
  'click #reset-button':function(){
    var originURL  = window.location.origin;

    var token = Random.secret();
    var when = new Date();
    let mailTo = $('#email').val().replace(/;/g, ",");
    let mailFrom = 'noreply@vs1cloud.com';
    let urlWithoutHash = originURL+'/resetpassword?token='+token;
    function isEmailValid(mailTo) {
        return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
    };

    if(!isEmailValid(mailTo)){
        Bert.alert('<strong>WARNING:</strong> The email field must be a valid email address !', 'warning');
        e.preventDefault();
        return false;
    }else{
      $('.fullScreenSpin').css('display','inline-block');
      var oReq = new XMLHttpRequest();
      oReq.open("GET",URLRequest + licenceIPAddress + ':' + checkSSLPorts + '/' + 'erpapi/TVS1_ClientUsers?PropertyList="EmailId,Password"&select=[EmailId]="'+mailTo+'"', true);
      oReq.setRequestHeader("database",vs1loggedDatatbase);
      oReq.setRequestHeader("username",'VS1_Cloud_Admin');
      oReq.setRequestHeader("password",'DptfGw83mFl1j&9');
      oReq.send();
      oReq.onreadystatechange = function() {
      if(oReq.readyState == 4 && oReq.status == 200) {
         var vs1Data = JSON.parse(oReq.responseText);

       if(vs1Data.tvs1_clientusers.length > 0){

         $('.fullScreenSpin').css('display','inline-block');
         ForgotPassword.insert({ useremail: mailTo,emailToken:token,createdAt: new Date() });

         Meteor.call('sendEmail', {
             from: "VS1 Cloud <info@vs1cloud.com>",
             to: mailTo,

             subject: '[VS1 Cloud] - Reset Your Password',
             text: 'A password reset has been requested for the account related to this address ('+mailTo+'). To reset the password, visit the following link:\n\n'+urlWithoutHash+'\n\n If you did not request this reset, please ignore this email. If you feel something is wrong, please contact our support team: support@vs1cloud.com.',
             html:'',
             attachments : ''

         }, function (error, result) {
             if (error && error.error === "error") {
                 Bert.alert('<strong>WARNING:</strong>' + error, 'warning');
                 event.preventDefault();
             } else {
               $('.fullScreenSpin').css('display', 'none');
               swal({
                   title: 'SUCCESS',
                   text: "Reset Email Sent To : " + mailTo,
                   type: 'success',
                   showCancelButton: false,
                   confirmButtonText: 'OK'
               }).then((result) => {
                 setTimeout(function () {
                   $('.fullScreenSpin').css('display','none');
                 window.open('/','_self');
                  }, 100);
               });


             }
         });
       }else{

         $('.fullScreenSpin').css('display','inline-block');
         Bert.alert('<strong>Error:</strong> Invalid Email, Email Not Found Please Try Again!', 'now-danger');
         Meteor.call('sendEmail', {
             from: "VS1 Cloud <info@vs1cloud.com>",
             to: mailTo,

             subject: '[VS1 Cloud] - Reset Your Password',
             text: 'VS1Cloud doesn’t have a registered user with that email address ['+mailTo+']. If you’re a registered user, then it’s with a different email address. Please contact us at support@vs1cloud.com.',
             html:'',
             attachments : ''
         }, function (error, result) {
             if (error && error.error === "error") {
                 Bert.alert('<strong>WARNING:</strong>' + error, 'warning');
                 event.preventDefault();
             } else {
               setTimeout(function () {
                 $('.fullScreenSpin').css('display','none');
               window.open('/','_self');
             }, 100);
             }
         });

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

  },
  'click .backtoLogin':function(){
    window.open('/','_self');
  }
});
