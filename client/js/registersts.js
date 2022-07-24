import { Mongo } from 'meteor/mongo';

Template.registersts.onCreated(function(){
  const templateObject = Template.instance();
  templateObject.countryRegion = new ReactiveVar();
  templateObject.currenctRegion = new ReactiveVar();
  });

if (Meteor.isClient) {
Template.registersts.events({
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
    let extraModuleAdd = '';


   var userEmail = event.target.email.value;

   var cloudpassword = event.target.password.value;
   var cloudconfirmpassword = event.target.confirmpassword.value;
   let getexpiredate = expiredate.split('/');
   let getMonth = getexpiredate[0]||0;
   let getYear = getexpiredate[1]||0;
   let licencelevel = 1;
   let paymentamount = 0;
   let packagePrice = 0;
   let discountPrice = 0;
   let renewalPrice = 0;
   let renewalDiscountPrice = 0;
   let discountDesc = "";

   var url = FlowRouter.current().path;
   let lineItemsForm = [];
   let lineItemObjForm = {};


   if((url.indexOf('?package=') > 0) && (url.indexOf('itemtotal=') > 0)){
     var getpackagename = url.split('?package=');
     let currentpackagename = getpackagename[getpackagename.length-1].split("&");
     let packagename  = currentpackagename[0].replace(/%20/g, " ");
     if(packagename == 'vs1_simplestart_trial'){
        licencelevel = 1;
        paymentamount = 0;
        packagePrice = 35;
        discountPrice = 0;
        renewalPrice = 35;
        renewalDiscountPrice = 35;
        discountDesc = "100% - 1 Month";
     }else if(packagename == 'vs1_essentials_trial'){
        licencelevel = 2;
        paymentamount = 0;
        packagePrice = 50;
        discountPrice = 0;
        renewalPrice = 50;
        renewalDiscountPrice = 50;
        discountDesc = "100% - 1 Month";
     }else if(packagename == 'vs1_plus_trial'){
        licencelevel = 3;
        paymentamount = 0;
        packagePrice = 75;
        discountPrice = 0;
        renewalPrice = 75;
        renewalDiscountPrice = 75;
        discountDesc = "100% - 1 Month";
     }else if(packagename == 'vs1_simplestart_sub'){
        licencelevel = 1;
        paymentamount = 17.50;
        packagePrice = 35;
        discountPrice = 17.50;
        renewalPrice = 35;
        renewalDiscountPrice = 17.50;
        discountDesc = "50% - 3 Months";
     }else if(packagename == 'vs1_essentials_sub'){
        licencelevel = 2;
        paymentamount = 25;
        packagePrice = 50;
        discountPrice = 25;
        renewalPrice = 50;
        renewalDiscountPrice = 25;
        discountDesc = "50% - 3 Months";
     }else if(packagename == 'vs1_plus_sub'){
        licencelevel = 3;
        paymentamount = 37.50;
        packagePrice = 75;
        discountPrice = 37.50;
        renewalPrice = 75;
        renewalDiscountPrice = 37.50;
        discountDesc = "50% - 3 Months";
     }else if(packagename == 'vs1_simplestart_foreigncurrency'){
        licencelevel = 1;
        paymentamount = 38.50;
        packagePrice = 35;
        discountPrice = 17.50;
        renewalPrice = 35;
        renewalDiscountPrice = 17.50;
        discountDesc = "50% - 3 Months";
        extraModuleAdd = [
            {
            "ModuleName":"Use Foreign Currency",
            "Price":42,
            "DiscountedPrice":21,
            "RenewPrice":42,
            "RenewDiscountedPrice":21,
            "RenewDiscountDesc":""
          }
          ];
     }else if(packagename == 'vs1_simplestart_pos'){
        licencelevel = 1;
        paymentamount = 37;
        packagePrice = 35;
        discountPrice = 17.50;
        renewalPrice = 35;
        renewalDiscountPrice = 17.50;
        discountDesc = "50% - 3 Months";
        extraModuleAdd = [
            {
            "ModuleName":"POS",
            "Price":39,
            "DiscountedPrice":19.5,
            "RenewPrice":39,
            "RenewDiscountedPrice":19.5,
            "RenewDiscountDesc":""
          }
          ];
     }else if(packagename == 'vs1_simplestart_expenseclaims'){
          licencelevel = 1;
          paymentamount = 28.5;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
              {
              "ModuleName":"Expense Claims / Receipt Claiming",
              "Price":22,
              "DiscountedPrice":11,
              "RenewPrice":22,
              "RenewDiscountedPrice":11,
              "RenewDiscountDesc":""
            }
            ];
     }else if(packagename == 'vs1_simplestart_webint'){
          licencelevel = 1;
          paymentamount = 65;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
              {
              "ModuleName":"Website Integration",
              "Price":95,
              "DiscountedPrice":47.5,
              "RenewPrice":95,
              "RenewDiscountedPrice":47.5,
              "RenewDiscountDesc":""
            }
            ];
     }else if(packagename == 'vs1_simplestart_foreigncurrency_pos_expenseclaims_webint'){
          licencelevel = 1;
          paymentamount = 116.5;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
                    {
                      "ModuleName":"Use Foreign Currency",
                      "Price":42,
                      "DiscountedPrice":21,
                      "RenewPrice":42,
                      "RenewDiscountedPrice":21,
                      "RenewDiscountDesc":""
                  },
                  {
                    "ModuleName":"POS",
                    "Price":39,
                    "DiscountedPrice":19.5,
                    "RenewPrice":39,
                    "RenewDiscountedPrice":19.5,
                    "RenewDiscountDesc":""
                },
                {
                  "ModuleName":"Expense Claims / Receipt Claiming",
                  "Price":22,
                  "DiscountedPrice":11,
                  "RenewPrice":22,
                  "RenewDiscountedPrice":11,
                  "RenewDiscountDesc":""
               },
                {
                "ModuleName":"Website Integration",
                "Price":95,
                "DiscountedPrice":47.5,
                "RenewPrice":95,
                "RenewDiscountedPrice":47.5,
                "RenewDiscountDesc":""
               }
            ];
     }else if(packagename == 'vs1_simplestart_foreigncurrency_expenseclaims_webint'){
          licencelevel = 1;
          paymentamount = 97;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
          		{
          		  "ModuleName":"Use Foreign Currency",
          		  "Price":42,
          		  "DiscountedPrice":21,
          		  "RenewPrice":42,
          		  "RenewDiscountedPrice":21,
          		  "RenewDiscountDesc":""
          	  },
          	 {
          	  "ModuleName":"Expense Claims / Receipt Claiming",
          	  "Price":22,
          	  "DiscountedPrice":11,
          	  "RenewPrice":22,
          	  "RenewDiscountedPrice":11,
          	  "RenewDiscountDesc":""
             },
          	{
          	"ModuleName":"Website Integration",
          	"Price":95,
          	"DiscountedPrice":47.5,
          	"RenewPrice":95,
          	"RenewDiscountedPrice":47.5,
          	"RenewDiscountDesc":""
             }
          ];
     }else if(packagename == 'vs1_simplestart_foreigncurrency_pos_webint'){
          licencelevel = 1;
          paymentamount = 105.5;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
              {
                "ModuleName":"Use Foreign Currency",
                "Price":42,
                "DiscountedPrice":21,
                "RenewPrice":42,
                "RenewDiscountedPrice":21,
                "RenewDiscountDesc":""
              },
             {
               "ModuleName":"POS",
           		 "Price":39,
           		 "DiscountedPrice":19.5,
           		 "RenewPrice":39,
           		 "RenewDiscountedPrice":19.5,
           		 "RenewDiscountDesc":""
             },
            {
            "ModuleName":"Website Integration",
            "Price":95,
            "DiscountedPrice":47.5,
            "RenewPrice":95,
            "RenewDiscountedPrice":47.5,
            "RenewDiscountDesc":""
             }
          ];
     }else if(packagename == 'vs1_simplestart_foreigncurrency_pos_expenseclaims'){
          licencelevel = 1;
          paymentamount = 69;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
              {
                "ModuleName":"Use Foreign Currency",
                "Price":42,
                "DiscountedPrice":21,
                "RenewPrice":42,
                "RenewDiscountedPrice":21,
                "RenewDiscountDesc":""
              },
             {
               "ModuleName":"POS",
           		 "Price":39,
           		 "DiscountedPrice":19.5,
           		 "RenewPrice":39,
           		 "RenewDiscountedPrice":19.5,
           		 "RenewDiscountDesc":""
             },
            {
              "ModuleName":"Expense Claims / Receipt Claiming",
          	  "Price":22,
          	  "DiscountedPrice":11,
          	  "RenewPrice":22,
          	  "RenewDiscountedPrice":11,
          	  "RenewDiscountDesc":""
             }
          ];
     }else if(packagename == 'vs1_simplestart_foreigncurrency_expenseclaims'){
          licencelevel = 1;
          paymentamount = 49.5;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
              {
                "ModuleName":"Use Foreign Currency",
                "Price":42,
                "DiscountedPrice":21,
                "RenewPrice":42,
                "RenewDiscountedPrice":21,
                "RenewDiscountDesc":""
              },
              {
              "ModuleName":"Expense Claims / Receipt Claiming",
          	  "Price":22,
          	  "DiscountedPrice":11,
          	  "RenewPrice":22,
          	  "RenewDiscountedPrice":11,
          	  "RenewDiscountDesc":""
             }
          ];
     }else if(packagename == 'vs1_simplestart_foreigncurrency_webint'){
          licencelevel = 1;
          paymentamount = 86;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
              {
                "ModuleName":"Use Foreign Currency",
                "Price":42,
                "DiscountedPrice":21,
                "RenewPrice":42,
                "RenewDiscountedPrice":21,
                "RenewDiscountDesc":""
              },
              {
                "ModuleName":"Website Integration",
                "Price":95,
                "DiscountedPrice":47.5,
                "RenewPrice":95,
                "RenewDiscountedPrice":47.5,
                "RenewDiscountDesc":""
             }
          ];
     }else if(packagename == 'vs1_simplestart_foreigncurrency_pos'){
          licencelevel = 1;
          paymentamount = 58;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
              {
                "ModuleName":"Use Foreign Currency",
                "Price":42,
                "DiscountedPrice":21,
                "RenewPrice":42,
                "RenewDiscountedPrice":21,
                "RenewDiscountDesc":""
              },
             {
               "ModuleName":"POS",
           		 "Price":39,
           		 "DiscountedPrice":19.5,
           		 "RenewPrice":39,
           		 "RenewDiscountedPrice":19.5,
           		 "RenewDiscountDesc":""
             }
          ];
     }else if(packagename == 'vs1_simplestart_pos_expenseclaims_webint'){
          licencelevel = 1;
          paymentamount = 95.5;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
                  {
                    "ModuleName":"POS",
                    "Price":39,
                    "DiscountedPrice":19.5,
                    "RenewPrice":39,
                    "RenewDiscountedPrice":19.5,
                    "RenewDiscountDesc":""
                },
                {
                  "ModuleName":"Expense Claims / Receipt Claiming",
                  "Price":22,
                  "DiscountedPrice":11,
                  "RenewPrice":22,
                  "RenewDiscountedPrice":11,
                  "RenewDiscountDesc":""
               },
                {
                "ModuleName":"Website Integration",
                "Price":95,
                "DiscountedPrice":47.5,
                "RenewPrice":95,
                "RenewDiscountedPrice":47.5,
                "RenewDiscountDesc":""
               }
            ];
     }else if(packagename == 'vs1_simplestart_pos_expenseclaims'){
          licencelevel = 1;
          paymentamount = 48;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
                  {
                    "ModuleName":"POS",
                    "Price":39,
                    "DiscountedPrice":19.5,
                    "RenewPrice":39,
                    "RenewDiscountedPrice":19.5,
                    "RenewDiscountDesc":""
                },
                {
                  "ModuleName":"Expense Claims / Receipt Claiming",
                  "Price":22,
                  "DiscountedPrice":11,
                  "RenewPrice":22,
                  "RenewDiscountedPrice":11,
                  "RenewDiscountDesc":""
               }
            ];
     }else if(packagename == 'vs1_simplestart_pos_webint'){
          licencelevel = 1;
          paymentamount = 84.5;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
                  {
                    "ModuleName":"POS",
                    "Price":39,
                    "DiscountedPrice":19.5,
                    "RenewPrice":39,
                    "RenewDiscountedPrice":19.5,
                    "RenewDiscountDesc":""
                },
                {
                "ModuleName":"Website Integration",
                "Price":95,
                "DiscountedPrice":47.5,
                "RenewPrice":95,
                "RenewDiscountedPrice":47.5,
                "RenewDiscountDesc":""
               }
            ];
     }else if(packagename == 'vs1_simplestart_expenseclaims_webint'){
          licencelevel = 1;
          paymentamount = 76;
          packagePrice = 35;
          discountPrice = 17.50;
          renewalPrice = 35;
          renewalDiscountPrice = 17.50;
          discountDesc = "50% - 3 Months";
          extraModuleAdd = [
                {
                  "ModuleName":"Expense Claims / Receipt Claiming",
                  "Price":22,
                  "DiscountedPrice":11,
                  "RenewPrice":22,
                  "RenewDiscountedPrice":11,
                  "RenewDiscountDesc":""
               },
                {
                "ModuleName":"Website Integration",
                "Price":95,
                "DiscountedPrice":47.5,
                "RenewPrice":95,
                "RenewDiscountedPrice":47.5,
                "RenewDiscountDesc":""
               }
            ];
     };


  };
   if(cloudpassword === cloudconfirmpassword){
   var cloudHashPassword = CryptoJS.MD5(cloudpassword).toString().toUpperCase();
    if(cloudpassword.length < 8) {

      swal('Invalid GreenTrack Password', 'Password must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'error');


      $('.fullScreenSpin').css('display','none');
    }else{

      var getpackagename = url.split('?package=');
      let currentpackagename = getpackagename[getpackagename.length-1].split("&");
    let packagenameCheck  = currentpackagename[0].replace(/%20/g, " ");

      let objDetails = "";
    if(packagenameCheck == 'vs1_seedtosale'){
      var getpaymentamount = url.split('itemtotal=');
      var currentpaymentamount = getpaymentamount[getpaymentamount.length-1].split('#')[0];

      objDetails = {
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
          CreditCardNotes:'QuoteID:'+currentURLQuoteID,
          CreditCardCVC:"567",
          LicenseRenewDurationType:"M",
          LicenseRenewDuration:1,
          CreditCardExpirymonth:11,
          CreditCardExpiryyear:25,
          Paymentamount:225,
          Paymethod:"Cash",

          Price:75,
          DiscountedPrice:75,
          DiscountDesc:"",
          RenewPrice:75,
          RenewDiscountedPrice:75,
          RenewDiscountDesc:"",
          LicenseLevel:3,
          ExtraModules:[
            {
            "ModuleName":"Seed To Sale",
            "Price":150,
            "DiscountedPrice":150,
            "RenewPrice":150,
            "RenewDiscountedPrice":150,
            "RenewDiscountDesc":""
          }



       ],
         StSDefaults:{
            "UseSeedtoSale":true,
            "StSInitWithDefaults":true,
            "StSPackageTagProduct":"StS Package Tag",
            "StSPlantTagProduct":"StS Plant Tag",
            "StSSupplier":"StS Metrc",
            "StSStockAccount":"StS Plant Stock",
            "StSUsesBins":true,
            "StSSimpleMode":true,
            "StSDefaultClass":"Sts1",
            "StSDefaultWeightUOM":"KG"
            }

         }
      };
    }else{
      if(extraModuleAdd == ""){
      objDetails = {
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
          CreditCardNotes:'QuoteID:'+currentURLQuoteID,
          CreditCardCVC:"567",
          LicenseRenewDurationType:"M",
          LicenseRenewDuration:1,
          CreditCardExpirymonth:11,
          CreditCardExpiryyear:25,
          Paymentamount:parseFloat(paymentamount),
          Paymethod:"Cash",

          Price:parseFloat(packagePrice),
          DiscountedPrice:parseFloat(discountPrice),
          DiscountDesc:discountDesc,
          RenewPrice:parseFloat(renewalPrice),
          RenewDiscountedPrice:parseFloat(renewalDiscountPrice),
          RenewDiscountDesc:"",
          LicenseLevel:parseInt(licencelevel)

         }
      };
    }else{
      objDetails = {
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
          CreditCardNotes:'QuoteID:'+currentURLQuoteID,
          CreditCardCVC:"567",
          LicenseRenewDurationType:"M",
          LicenseRenewDuration:1,
          CreditCardExpirymonth:11,
          CreditCardExpiryyear:25,
          Paymentamount:parseFloat(paymentamount),
          Paymethod:"Cash",

          Price:parseFloat(packagePrice),
          DiscountedPrice:parseFloat(discountPrice),
          DiscountDesc:discountDesc,
          RenewPrice:parseFloat(renewalPrice),
          RenewDiscountedPrice:parseFloat(renewalDiscountPrice),
          RenewDiscountDesc:"",
          LicenseLevel:parseInt(licencelevel),
          ExtraModules:extraModuleAdd
         }
      };
    }
  }

      var erpGet = erpDb();
  var oPost = new XMLHttpRequest();
  var serverIP = licenceIPAddress;
  var port = checkSSLPorts;
  oPost.open("POST",URLRequest + serverIP + ':' + port + '/' + 'erpapi' + '/' + 'VS1_Cloud_Task/Method?Name="VS1_NewRego"', true);
  oPost.setRequestHeader("database",vs1loggedDatatbase);
  oPost.setRequestHeader("username","VS1_Cloud_Admin");
  oPost.setRequestHeader("password","DptfGw83mFl1j&9");
  oPost.setRequestHeader("Accept", "application/json");
  oPost.setRequestHeader("Accept", "application/html");
  oPost.setRequestHeader("Content-type", "application/json");


    var myString = '"JsonIn"'+':'+JSON.stringify(objDetails);
    oPost.send(myString);


    oPost.onreadystatechange = function() {

  if (oPost.readyState == 4 && oPost.status == 200) {

  var myArrResponse = JSON.parse(oPost.responseText);
  let dataTocheck = "'"+userEmail+"' Already Exists for Another Client";

  if(myArrResponse.ProcessLog.Error){
    var segError = myArrResponse.ProcessLog.Error;
    if((segError) == dataTocheck){
        swal('Email Already Exists', "We see that your email address '"+userEmail+"' is already linked with a GreenTrack Cloud account. <br> Please log into GreenTrack Cloud and make your purchase from the Settings module.", 'info');
    }else{
        swal('Database Error', myArrResponse.ProcessLog.Error, 'error');
    }


    $('.fullScreenSpin').css('display','none');
  }else{
    var databaseName = myArrResponse.ProcessLog.Databasename;
    $(".addloginkey").attr("href", 'https://sandbox.vs1cloud.com/vs1greentracklogin?emailakey='+userEmail+'&passkey='+cloudpassword+'&secret='+currentURLQuoteID+'');
    localStorage.usremail = userEmail;
    localStorage.usrpassword = cloudpassword;





       CloudDatabase.insert({ server: serverIP,database:databaseName,username:userEmail.toLowerCase(),useremail:userEmail.toLowerCase(),password:cloudpassword,port:port,description:company,createdAt: new Date() }, function(err, idTag) {
         if (err) {
           $('.fullScreenSpin').css('display','none');

         } else {

           CloudUser.insert({ clouddatabaseID:idTag,cloudEmail:userEmail.toLowerCase(),cloudUsername:userEmail.toLowerCase(),cloudPassword:cloudpassword,cloudHashPassword:cloudHashPassword,server: serverIP,database:databaseName,username:userEmail,password:cloudpassword,port:port,userMultiLogon:false,createdAt: new Date() });
         }
       });


       let mailBodyNew = $('.emailBody').html();
       Meteor.call('sendEmail', {
           from: "GreenTrack Cloud <info@vs1cloud.com>",
           to: userEmail,
           cc: 'info@vs1cloud.com',
           subject: '[GreenTrack Cloud] - Account Creation',
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
text: 'It seems we are unable to connect you to GreenTrack Cloud at the moment. Please try again in a few minutes.',
type: 'error',
showCancelButton: false,
confirmButtonText: 'Try Again'
}).then((result) => {
if (result.value) {
  Meteor._reload.reload();
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

}else if(oPost.readyState == 4 && oPost.status == 407){
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

'click .btnCloseRedirect': function () {
let first_name  = $('#fname').val();
let last_name = $('#lname').val();
let useremail = $('#email').val();
let userpassword = $('#confirmpassword').val();


window.location = 'https://www.vs1greentrack.com/GreenTrack.exe';
setTimeout(function () { window.open('https://www.vs1greentrack.com/purchaseaddcustomer.php?firstname='+first_name+'&lastname='+last_name+'&email='+useremail+'&password='+userpassword+'','_self'); }, 1000);

},

'click .btnGetAccess': function () {

  var serverTest = URLRequest + "192.168.1.50" + ':' + "850" + '/erpapi/TUser';

  var oReq = new XMLHttpRequest();
  oReq.open("GET",serverTest, true);
  oReq.setRequestHeader("database","VS1_Cloud_DB_caca_ai_ci_4SpUDH");
  oReq.setRequestHeader("username","t1@t1.com");
  oReq.setRequestHeader("password","Pass@123");

  oReq.send();



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
      if(emailData != ''){
      if(!isEmailValid(emailData)){

          swal('Oops...', 'The email field must be a valid email address, please re-enter your email addres and try again!', 'error');


          e.preventDefault();
          return false;
      }
    }
    },
    'blur #cname' : function(event){
      let companyName = $(event.target).val().replace(/;/g, ",");
      $('.emCompanyName').html("Welcome to GreenTrack, "+companyName+ '!');
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

              swal('Invalid GreenTrack Password', 'Password must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'error');

              e.preventDefault();
              return false;
      }

    },
    'click .btnReset' : function(event){

              $('#fname').focus();

    }
});
}


Template.registersts.onRendered( function() {
  const templateObject = Template.instance();









  let currentURL = FlowRouter.current().queryParams;

  if(currentURL.company){
    $('#cname').val(currentURL.company);
    $('.emCompanyName').html("Welcome to GreenTrack, "+currentURL.company+ '!');
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

/*
oReq.onload = function(){

  var ErrorMessage = oReq.getResponseHeader('content-type');
};
*/
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
    Bert.alert('<strong>Error: Invalid GreenTrack Password</strong> must be at <b>least eight characters</b> including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
    $('.CloudPassword').css('border-color','red');
    }else {

        if(pswd.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/)) {
          $('.CloudPassword').css('border-color','#b5b8bb #e2e4e7 #e8eaec #bdbfc3');
        } else {
          Bert.alert('<strong>Error: Invalid GreenTrack Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
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

/*
var getRegionOptions = URLRequest + "192.168.1.100" + ':' + "88" + '/erpapi/TRegionalOptions?PropertyList="CountryName, Region, CurrencySymbol, RegionAbbreviation"';
let regionOptions = [];
var oReq = new XMLHttpRequest();
oReq.open("GET",getRegionOptions, true);
oReq.setRequestHeader("database","vs1_cloud");
oReq.setRequestHeader("username","VS1_Cloud_Admin");
oReq.setRequestHeader("password","DptfGw83mFl1j&9");

oReq.send();



oReq.onreadystatechange = function() {

  if (oReq.readyState == 4 && oReq.status == 200) {
    var data = JSON.parse(oReq.responseText);
    for (let i = 0; i < data.tregionaloptions.length; i++) {
        regionOptions.push(data.tregionaloptions[i].Region)
    }
    regionOptions = _.sortBy(regionOptions);
    templateObject.countryRegion.set(regionOptions);

  } else if(oReq.statusText == '') {


  }else if(oReq.readyState == 4 && oReq.status == 403){


  }else if(oReq.readyState == 4 && oReq.status == 406){


  }else if(oReq.readyState == 4 && oReq.status == 500){


  }else{

  }
}
*/
});

Template.registersts.helpers({

  regionOptions: () => {
      return Template.instance().countryRegion.get();
  },
  currentRegions: () => {
    return Template.instance().currenctRegion.get();
  }

  });
