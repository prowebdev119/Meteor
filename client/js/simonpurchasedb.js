import { Mongo } from 'meteor/mongo';

Template.simonpurchasedb.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.countryRegion = new ReactiveVar();
  templateObject.currenctRegion = new ReactiveVar();
  });

if (Meteor.isClient) {
Template.simonpurchasedb.events({
  'submit .addDatabaseForm' : function (event, template) {

   $('.fullScreenSpin').css('display','inline-block');
   event.preventDefault();
   var firstname = event.target.fname.value;
   var lastname = event.target.lname.value;
   var company = event.target.cname.value;
   var phonenumber = event.target.phone.value;
   var country = event.target.country.value;

   let currentURLQuoteID = '';
   if(FlowRouter.current().queryParams.quoteid){
     currentURLQuoteID = FlowRouter.current().queryParams.quoteid;
   }




    var expiredate = "11/30";


   var userEmail = event.target.email.value;

   var cloudpassword = event.target.password.value;
   var cloudconfirmpassword = event.target.confirmpassword.value;
   let getexpiredate = expiredate.split('/');
   let getMonth = getexpiredate[0]||0;
   let getYear = getexpiredate[1]||0;
   let licencelevel = 1;
   let paymentamount = 24;
   var url = FlowRouter.current().path;
   if((url.indexOf('?package=') > 0) && (url.indexOf('itemtotal=') > 0)){

     var getpackagename = url.split('?package=');
     let currentpackagename = getpackagename[getpackagename.length-1].split("&");
     let packagename  = currentpackagename[0].replace(/%20/g, " ");
     if(packagename == 'simplebuynow'){
        licencelevel = 1;
     }else if(packagename == 'essentialsbuynow'){
        licencelevel = 2;
     }else if(packagename == 'plusbuynow'){
        licencelevel = 3;
     }else if(packagename == 'simpletrynow'){
        licencelevel = 1;
     }else if(packagename == 'essentialstrynow'){
        licencelevel = 2;
     }else if(packagename == 'plustrynow'){
        licencelevel = 3;
     };

     var getpaymentamount = url.split('itemtotal=');
     var currentpaymentamount = getpaymentamount[getpaymentamount.length-1].split('#')[0];
    paymentamount = parseFloat(currentpaymentamount)||0;
  };
   if(cloudpassword === cloudconfirmpassword){
   var cloudHashPassword = CryptoJS.MD5(cloudpassword).toString().toUpperCase();
    if(cloudpassword.length < 8) {

      swal('Invalid VS1 Password', 'Password must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'error');


      $('.fullScreenSpin').css('display','none');
    }else{
      let objDetails = {
          Name: "VS1_NewRego",
          Params: {
          ClientName : company,
          CloudUserName : userEmail,
          CloudPassword:cloudpassword,
          FirstName:firstname,
          LastName:lastname,
          PhoneNumber:phonenumber,
          RegionName:country,
          CreditCardType:"Visa",
          CreditCardCardHolderName:company,
          CreditCardNumber:"4242424242424242",
          CreditCardNotes:'Magento Quote ID:'+currentURLQuoteID,
          CreditCardCVC:"567",
          CreditCardExpirymonth:11,
          CreditCardExpiryyear:25,
          Paymentamount:paymentamount,
          Paymethod:"Cash",

          LicenseLevel:parseInt(licencelevel)

         }
      };

      var erpGet = erpDb();
  var oPost = new XMLHttpRequest();
  var serverIP = '192.168.1.19';
  var port = '88';
  oPost.open("POST",URLRequest + serverIP + ':' + port + '/' + 'erpapi' + '/' + 'VS1_Cloud_Task/Method?Name="VS1_NewRego"', true);
  oPost.setRequestHeader("database",vs1loggedDatatbase);
  oPost.setRequestHeader("username","VS1_Cloud_Admin");
  oPost.setRequestHeader("password","DptfGw83mFl1j&9");
  oPost.setRequestHeader("Accept", "application/json");
  oPost.setRequestHeader("Accept", "application/html");
  oPost.setRequestHeader("Content-type", "application/json");

    var myString = JSON.stringify(objDetails);
    oPost.send(myString);


    oPost.onreadystatechange = function() {

  if (oPost.readyState == 4 && oPost.status == 200) {

  var myArrResponse = JSON.parse(oPost.responseText);

  if(myArrResponse.ProcessLog.Error){

    swal('Database Error', myArrResponse.ProcessLog.Error, 'error');
    $('.fullScreenSpin').css('display','none');
  }else{
    var databaseName = myArrResponse.ProcessLog.Databasename;






       CloudDatabase.insert({ server: serverIP,database:databaseName,username:userEmail.toLowerCase(),useremail:userEmail.toLowerCase(),password:cloudpassword,port:port,description:company,createdAt: new Date() }, function(err, idTag) {
         if (err) {
           $('.fullScreenSpin').css('display','none');

         } else {

           CloudUser.insert({ clouddatabaseID:idTag,cloudEmail:userEmail.toLowerCase(),cloudUsername:userEmail.toLowerCase(),cloudPassword:cloudpassword,cloudHashPassword:cloudHashPassword,server: serverIP,database:databaseName,username:userEmail,password:cloudpassword,port:port,userMultiLogon:false,createdAt: new Date() });
         }
       });

       localStorage.usremail = userEmail;
       localStorage.usrpassword = cloudpassword;
       let mailBodyNew = $('.emailBody').html();
       Meteor.call('sendEmail', {
           from: "VS1 Cloud <info@vs1cloud.com>",
           to: userEmail,
           cc: 'info@vs1cloud.com',
           subject: '[VS1 Cloud] - Account Creation',
           text: '',
           html:mailBodyNew,
           attachments : ''

       }, function (error, result) {

             setTimeout(function () {
               $('.fullScreenSpin').css('display','none');

             $('#myModal').modal('toggle');
           }, 50);

       });





  }

  } else if(oPost.readyState == 4 && oPost.status == 403){
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


    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }else{

    swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }

}else if(oPost.readyState == '') {
  $('.fullScreenSpin').css('display','none');

  swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
}


  }
    }


    }else{
      $('.fullScreenSpin').css('display','none');

      swal('Ooops...', 'The specified passwords do no match, Please try again!', 'error');
      $('.confirmpassword').focus();
    }


},
'click .btnLogin':    function(e) {
  window.open('/','_blank');
    },
    'blur #email' : function(event){
      let emailData = $(event.target).val().replace(/;/g, ",");
      $('#emEmail').html(emailData);
      function isEmailValid(emailData) {
          return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailData);
      };

      if(!isEmailValid(emailData)){




          e.preventDefault();
          return false;
      }
    },
    'blur #cname' : function(event){
      let companyName = $(event.target).val().replace(/;/g, ",");
      $('.emCompanyName').html("Welcome to VS1Cloud, "+companyName+ '!');
    },
    'blur #confirmpassword' : function(event){
      let cloudconfirmpassword = $(event.target).val().replace(/;/g, ",");
      let cloudpassword = $('#password').val().replace(/;/g, ",");
      if(cloudpassword === cloudconfirmpassword){
        $('#emPassword').html(cloudconfirmpassword);
      }else{

        swal('Oops...', 'The specified passwords does not match, please re-enter your password and try again!', 'error');


        e.preventDefault();
        return false;
      }

    },
    'blur #password' : function(event){
      let cloudpassword = $(event.target).val().replace(/;/g, ",");
      if(cloudpassword.length < 8) {

              swal('Invalid VS1 Password', 'Password must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'error');

              e.preventDefault();
              return false;
      }

    },
    'click .btnReset' : function(event){

              $('#fname').focus();

    }
});
}


Template.simonpurchasedb.onRendered( function() {
  const templateObject = Template.instance();

  let currentURL = FlowRouter.current().queryParams;

  if(currentURL.company){
    $('#cname').val(currentURL.company);
    $('.emCompanyName').html("Welcome to VS1Cloud, "+currentURL.company+ '!');
  };
   if(currentURL.firstname){
    $('#fname').val(currentURL.firstname);
  };
   if(currentURL.lastname){
    $('#lname').val(currentURL.lastname);
  };
   if(currentURL.phone){
    $('#phone').val(currentURL.phone);
  };
   if(currentURL.email){
    $('#email').val(currentURL.email);
  };
      $.get("https://ipinfo.io", function(response) {

      if(response.country === "AU"){
        templateObject.currenctRegion.set("Australia");
      }else if(response.country === "ZA"){
        templateObject.currenctRegion.set("South Africa");
      }else if(response.country === "USA"){
        templateObject.currenctRegion.set("United States");
      }else if(response.country === "MEX"){
        templateObject.currenctRegion.set("Mexico");
      }else if(response.country === "CAN"){
        templateObject.currenctRegion.set("Canada");
      }

      let currencyRegion = templateObject.currenctRegion.get();
      if(currencyRegion){
        $('#country').val(currencyRegion);
      };

    }, "jsonp");
        if (window.matchMedia('(max-width: 500px)').matches) {
             $( "#leftcol" ).removeClass( "col-12-narrow" );
             $( "#leftcol" ).addClass( "col-12" );

             $( "#rightcol" ).removeClass( "col-12-narrow" );
             $( "#rightcol" ).addClass( "col-12" );
        }


  $(document).on('click', '.btn_delete', function () {
    event.stopPropagation();
        this.click;
  var id = $(this).closest('tr').find("[id=ID1]").val();
  var serverIP = $(this).closest('tr').find("[id=Server1]").val();
  var databaseName =  $(this).closest('tr').find("[id=Database1]").val();
  var userName = $(this).closest('tr').find("[id=Username1]").val();
  var password = $(this).closest('tr').find("[id=Password1]").val();
  var port = $(this).closest('tr').find("[id=Port1]").val();
  var description = $(this).closest('tr').find("[id=Description1]").val();
  if ( confirm( "Are you sure you want to delete? This is permanent." ) ) {
  CloudDatabase.remove({_id:id}, {server: serverIP,database:databaseName,username:userName,password:password,port:port,description:description});
  var usertoDelete = CloudUser.find({clouddatabaseID:id}).forEach(function(doc){
  CloudUser.remove({_id:doc._id});
  });
  Bert.alert('<strong>Success:</strong> Server connection details for: <strong>'+databaseName+'</strong> successfully deleted!', 'success');
  $(this).closest('tr').remove();
      event.preventDefault();
      return false;
    }
  });

  $(document).on('click', '.btn_update', function () {
    event.stopPropagation();
        this.click;
  var id = $(this).closest('tr').find("[id=ID1]").val();
  var serverIP = $(this).closest('tr').find("[id=Server1]").val();
  var databaseName =  $(this).closest('tr').find("[id=Database1]").val();
  var userName = $(this).closest('tr').find("[id=Username1]").val();
  var userEmail = $(this).closest('tr').find("[id=Useremail1]").val();
  var password = $(this).closest('tr').find("[id=Password1]").val();
  var port = $(this).closest('tr').find("[id=Port1]").val();
  var description = $(this).closest('tr').find("[id=Description1]").val();
  var cloudPassword = $(this).closest('tr').find("[id=CloudPassword1]").val();
  var cloudHashPassword = CryptoJS.MD5(cloudPassword).toString().toUpperCase();
  CloudDatabase.update({_id:id}, {server: serverIP,database:databaseName,username:userName,useremail:userEmail,password:password,port:port,description:description}, function(err, idTag) {
    if(err){

    }else{
      var queryList = [];
      var usertoUpdate = CloudUser.find({clouddatabaseID:id}).forEach(function(doc){

      if(doc.cloudEmail == userEmail){
        if(cloudPassword != ''){
        if(doc.cloudPassword != cloudPassword ){
          CloudUser.update({_id:doc._id}, {$set:{clouddatabaseID:id,server: serverIP,database:databaseName,username:userName,cloudPassword:cloudPassword,cloudHashPassword:cloudHashPassword,password:password,port:port,userMultiLogon:false}});
        }
      }else{
        CloudUser.update({_id:doc._id}, {$set:{clouddatabaseID:id,server: serverIP,database:databaseName,username:userName,password:password,port:port,userMultiLogon:false}});
      }
      }else{
        CloudUser.update({_id:doc._id}, {$set:{clouddatabaseID:id,server: serverIP,database:databaseName,username:userName,password:password,port:port,userMultiLogon:false}});
      }

      });

    }
   });
  Bert.alert('<strong>Success:</strong> Server connection details successfully updated for <strong>'+databaseName+'</strong>!', 'success');
      event.preventDefault();


  });

  $(document).on('click', '.btn_test', function () {
    $('.fullScreenSpin').css('display','inline-block');
    event.stopPropagation();
        this.click;
  var id = $(this).closest('tr').find("[id=ID1]").val();
  var serverIP = $(this).closest('tr').find("[id=Server1]").val();
  var databaseName =  $(this).closest('tr').find("[id=Database1]").val();
  var userName = $(this).closest('tr').find("[id=Username1]").val();
  var password = $(this).closest('tr').find("[id=Password1]").val();
  var port = $(this).closest('tr').find("[id=Port1]").val();
  var description = $(this).closest('tr').find("[id=Description1]").val();

  var usertoReset = CloudUser.find({clouddatabaseID:id}).forEach(function(doc){

  CloudUser.update({_id: doc._id},{ $set: {userMultiLogon: false}});
  });


var serverTest = URLRequest + serverIP + ':' + port + '/erpapi/TERPSysInfo';

var oReq = new XMLHttpRequest();
oReq.open("GET",serverTest, true);
oReq.setRequestHeader("database",databaseName);
oReq.setRequestHeader("username",userName);
oReq.setRequestHeader("password",password);


oReq.send();


oReq.timeout = 30000;
oReq.onreadystatechange = function() {

  if (oReq.readyState == 4 && oReq.status == 200) {


    $('#isnotokayres').css('display','none');
    $('#isokay').css('display','block');
    document.getElementById("isokay").innerHTML = 'Testing Connection to <strong>'+databaseName+'</strong> server <b style="float:right"> Pass </b>';
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isokay').css('display','none');
    }, 3500);

  } else if(oReq.statusText == '') {
    $('#isokay').css('display','none');
    $('#isnotokayres').css('display','block');

    if(oReq.getResponseHeader('errormessage')){
     document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> server <b style="float:right"> Fail {'+ oReq.getResponseHeader('errormessage') +'}</b></p>';
    }else{
      document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> server <b style="float:right"> Fail </b></p>';
    }
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isnotokayres').css('display','none');
    }, 3500);

  }else if(oReq.readyState == 4 && oReq.status == 403){
    $('#isokay').css('display','none');
    $('#isnotokayres').css('display','block');
    if(oReq.getResponseHeader('errormessage')){
       document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail {'+ oReq.getResponseHeader('errormessage') +'}</b></p>';
    }else{
      document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail </b></p>';
    }
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isnotokayres').css('display','none');
    }, 3500);

  }else if(oReq.readyState == 4 && oReq.status == 406){
    $('#isokay').css('display','none');
    $('#isnotokayres').css('display','block');
    if(oReq.getResponseHeader('errormessage')){
     document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail {'+ oReq.getResponseHeader('errormessage') +'}</b></p>';
    }else{
    document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail </b></p>';
    }
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isnotokayres').css('display','none');
    }, 3500);

  }else if(oReq.readyState == 4 && oReq.status == 500){
    $('#isokay').css('display','none');
    $('#isnotokayres').css('display','block');
    if(oReq.getResponseHeader('errormessage')){
     document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail {'+ oReq.getResponseHeader('errormessage') +'}</b></p>';
    }else{
    document.getElementById("isnotokayres").innerHTML = '<p>Testing Connection to <strong>'+databaseName+'</strong> database <b style="float:right"> Fail </b></p>';
    }
    $('.fullScreenSpin').css('display','none');
    setTimeout(function () {
      $('#isnotokayres').css('display','none');
    }, 3500);

  }else{
    $('.fullScreenSpin').css('display','none');
  }

AddUERP(oReq.responseText);
}

  });

$(document).ready(function() {
  $('.CloudPassword').keyup(function() {

  }).focus(function() {

  }).blur(function() {
    var pswd = $(this).val();

    if(pswd.length < 8) {
    Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at <b>least eight characters</b> including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
    $('.CloudPassword').css('border-color','red');
    }else {

        if(pswd.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)) {
          $('.CloudPassword').css('border-color','#b5b8bb #e2e4e7 #e8eaec #bdbfc3');
        } else {
          Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
          $('.CloudPassword').css('border-color','red');
        }

    }


  });

  $('#expdate').keyup(function() {
    var expiryValue = $(this).val();
    let operationValue = '';
    if(expiryValue.length === 2) {
      operationValue= expiryValue+'/';
      $('#expdate').val(operationValue);
    }

  }).focus(function() {
    $(this).select();
  }).blur(function() {

  }).keydown(function() {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||

           (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||

           (event.keyCode >= 35 && event.keyCode <= 40)) {

                return;
       }

      if (event.shiftKey == true) {
          event.preventDefault();
      }

      if ((event.keyCode >= 48 && event.keyCode <= 57) ||
      (event.keyCode >= 96 && event.keyCode <= 105) ||
      event.keyCode == 8 || event.keyCode == 9 ||
      event.keyCode == 37 || event.keyCode == 39 ||
      event.keyCode == 46 || event.keyCode == 190) {
      } else {
          event.preventDefault();
      }
  });
});


});

Template.simonpurchasedb.helpers({

  regionOptions: () => {
      return Template.instance().countryRegion.get();
  },
  currentRegions: () => {
    return Template.instance().currenctRegion.get();
  }

  });
