import {ReactiveVar} from 'meteor/reactive-var';
import {TaxRateService} from "../settings-service";
import 'colresizable/colResizable-1.6.min';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
let _ = require('lodash');
Template.linktrueerp.onRendered(function(){
  var erpGet = erpDb();
  let objDetailsUser = {
      Name: "VS1_DbConnectTest",
      Params: {
        ServerName: erpGet.ERPIPAddress,
        Databasename:erpGet.ERPDatabase,
        VS1UserName: erpGet.ERPUsername,
        VS1Password: erpGet.ERPPassword,
        APIPort:erpGet.ERPPort,
        IsHttps:erpGet.ERPUseSSL
    }
  };
    var oPost = new XMLHttpRequest();
    oPost.open("POST",URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_DbConnectTest"', true);
    oPost.setRequestHeader("database",vs1loggedDatatbase);
    oPost.setRequestHeader("username",'VS1_Cloud_Admin');
    oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
    oPost.setRequestHeader("Accept", "application/json");
    oPost.setRequestHeader("Accept", "application/html");
    oPost.setRequestHeader("Content-type", "application/json");
    var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);
    //var myString = JSON.stringify(objDetailsUser);

     oPost.send(myString);

  oPost.onreadystatechange = function() {
  if(oPost.readyState == 4 && oPost.status == 200) {
    $('.led-red').css('display','none');
    $('.led-green').css('display','block');
  }else if(oPost.readyState == 4 && oPost.status == 403){
    $('.led-red').css('display','block');
    $('.led-green').css('display','none');
  }else if(oPost.readyState == 4 && oPost.status == 406){
    $('.led-red').css('display','block');
    $('.led-green').css('display','none');

  }else if(oPost.readyState == '') {
    $('.led-red').css('display','block');
    $('.led-green').css('display','none');
  }
  }

});
Template.linktrueerp.events({
'click .btnSave': function () {
  var erpGet = erpDb();
  $('.fullScreenSpin').css('display','inline-block');
  let firstName = $('.edtFirstName').val();
  let lastName = $('.edtLastName').val();
  let phoneNumber = $('.edtPhone').val();

  let serverName = $('.edtServerName').val();
  let databaseName = $('.edtDatabaseName').val();
  let portNo = $('.edtPortNo').val();
  let erpUsername = $('.edtERPUsername').val();
  let erpPassword = $('.edtERPPassword').val();

  var currentDate = new Date();
  var begunDate = moment(currentDate).format("YYYY-MM-DD");
  let isHttpsConnect = true;
  if($('input[name="formCheck-https"]').is(":checked")){
      isHttpsConnect = true;
  }else{
      isHttpsConnect = false;
  }
  let objDetailsUser = {
      Name: "VS1_ChangeDatabase",
      Params: {
        ServerName: serverName,
        Databasename:databaseName,
        DatabasenameToChange: erpGet.ERPDatabase,
        VS1UserName: "VS1_Temp_User", //erpGet.ERPUsername
        VS1Password: "Dpjhge8rnvl1j&9",
        APIPort:parseFloat(portNo)||0,
        IsHttps:isHttpsConnect,
        EmployeeDetails:{
         FirstName:firstName,
         LastName:lastName,
         Phone:phoneNumber,
         DateStarted:begunDate|| '',
         DOB:begunDate|| '',
         Sex:"F",
         Email:erpUsername,
         EmailsFromEmployeeAddress:false,
         ERPUserName : erpUsername,
         ERPPassword : erpPassword
       }
       /*,
       ERPLoginDetails:{
         ERPUserName : erpUsername,
         NewPassword : erpPassword
       }
       */
    }
  };
    var oPost = new XMLHttpRequest();
    oPost.open("POST",URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_ChangeDatabase"', true);
    oPost.setRequestHeader("database",vs1loggedDatatbase);
    oPost.setRequestHeader("username",'VS1_Cloud_Admin');
    oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
    oPost.setRequestHeader("Accept", "application/json");
    oPost.setRequestHeader("Accept", "application/html");
    oPost.setRequestHeader("Content-type", "application/json");
    //var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);
    var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);

     oPost.send(myString);

  oPost.onreadystatechange = function() {
  if(oPost.readyState == 4 && oPost.status == 200) {

      $('.fullScreenSpin').css('display','none');
      var myArrResponse = JSON.parse(oPost.responseText);
      if(myArrResponse.ProcessLog.Error){
        swal('Oooops...', myArrResponse.ProcessLog.Error, 'error');
      }else{
        swal({
        title: 'Database Successfully Linked to VS1',
        text: "Please log out to activate your changes.",
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'OK'
        }).then((result) => {
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
        });

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
  // Meteor._reload.reload();
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
},
'click .btnBack':function(event){
  event.preventDefault();
  history.back();
},
'keydown .edtPortNo': function(event) {
    if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
        // Allow: Ctrl+A, Command+A
        (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
        // Allow: home, end, left, right, down, up
        (event.keyCode >= 35 && event.keyCode <= 40)) {
        // let it happen, don't do anything
        return;
    }

    if (event.shiftKey == true) {
        event.preventDefault();
    }

    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 ||
        event.keyCode == 37 || event.keyCode == 39 ||
        event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {} else {
        event.preventDefault();
    }
},
'click .btnUploadERPUSer': async function (event) {
    $('.fullScreenSpin').css('display', 'inline-block');
    let taxRateService = new TaxRateService();
    var erpGet = erpDb();

    taxRateService.getUserDetails().then(function (data) {
      if(data.temployee.length > 0){
        for (let i = 0; i < data.temployee.length; i++) {
          let dataLength = data.temployee.length * 2500;
            if (data.temployee[i].fields.User != null) {

              var enteredEmail = data.temployee[i].fields.Email||'';
              let cloudpassword = data.temployee[i].fields.User.fields.LogonPassword||'';
              let employeeSaveID = data.temployee[i].fields.ID||'';
              var empFirstName = data.temployee[i].fields.FirstName||'';
              var empLastName = data.temployee[i].fields.LastName||'';
              var empMiddleName = data.temployee[i].fields.MiddleName||'';
              var empPhone = data.temployee[i].fields.Phone||'';

              let empDOB = data.temployee[i].fields.DOB ||'';
              let empStartDate = data.temployee[i].fields.DateStarted ||'';

              var empGender = data.temployee[i].fields.Sex || 'M';
              let addgender = '';
              if (empGender === "Male") {
                  addgender = "M";
              } else if (empGender === "Female") {
                  addgender = "F";
              } else {
                  addgender = empGender;
              };
              var enteredEmail = data.temployee[i].fields.Email||'';
              var enteredPassword = data.temployee[i].fields.User.fields.LogonPassword||'';
              var cloudHashPassword = CryptoJS.MD5(enteredPassword.toUpperCase()).toString();

              if(data.temployee[i].fields.Email != ''){
                //Save data Here
                let objDetailsUser = {
                    //JsonIn:{
                    Name: "VS1_NewUser",
                    Params: {
                        Vs1UserName: enteredEmail,
                        Vs1Password: enteredPassword,
                        Modulename: "Add Extra User",
                        // Paymentamount:35,
                        Paymentamount: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                        PayMethod: "Cash",
                        Price: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                        DiscountedPrice: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                        DiscountDesc: "",
                        RenewPrice: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                        RenewDiscountedPrice: Number(addExtraUserPrice.replace(/[^0-9.-]+/g, "")) || 35,
                        RenewDiscountDesc: "Free User Included in the license - TrueERP Users",
                        // PayMethod:"Cash",
                        EmployeeDetails: {
                            ID: parseInt(employeeSaveID) || 0,
                            FirstName: empFirstName,
                            LastName: empLastName,
                            MiddleName: empMiddleName || '',
                            Phone: empPhone,
                            DateStarted: empStartDate,
                            DOB: empDOB,
                            Sex: addgender,
                        },
                        DatabaseName: erpGet.ERPDatabase,
                        ServerName: erpGet.ERPIPAddress,
                        ERPLoginDetails: {
                            ERPUserName: localStorage.getItem('mySession'),
                            ERPPassword: localStorage.getItem('EPassword')
                        }
                    }
                    //}
                };

                var oPost = new XMLHttpRequest();
                oPost.open("POST", URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_NewUser"', true);
                oPost.setRequestHeader("database", vs1loggedDatatbase);
                oPost.setRequestHeader("username", 'VS1_Cloud_Admin');
                oPost.setRequestHeader("password", 'DptfGw83mFl1j&9');
                oPost.setRequestHeader("Accept", "application/json");
                oPost.setRequestHeader("Accept", "application/html");
                oPost.setRequestHeader("Content-type", "application/json");

                var myString = '"JsonIn"' + ':' + JSON.stringify(objDetailsUser);
                oPost.send(myString);
                oPost.onreadystatechange = async function () {
                    if (oPost.readyState == 4 && oPost.status == 200) {

                        // $('.fullScreenSpin').css('display', 'none');
                        // var myArrResponse = JSON.parse(oPost.responseText);

                    }


                }

              }//End Save data


          }

          setTimeout(function () {

            $('.fullScreenSpin').css('display', 'none');
            swal({
            title: 'ERP User Successfully Imported to VS1',
            text: "Please log out to activate your changes.",
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'OK'
            }).then((result) => {
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
            });
          }, parseInt(dataLength));
        }
     }
    }).catch(function (err) {

    });

}
});

Template.linktrueerp.helpers({
  isCloudTrueERP: function() {
      let checkCloudTrueERP = Session.get('CloudTrueERPModule') || false;
      return checkCloudTrueERP;
  }
});
