import {ReactiveVar} from 'meteor/reactive-var';
import {TaxRateService} from "../settings-service";
import 'colresizable/colResizable-1.6.min';
import 'jquery-ui-dist/external/jquery/jquery';
import 'jquery-ui-dist/jquery-ui';
import 'jquery-ui-dist/jquery-ui.css';
let _ = require('lodash');
Template.backuprestore.onCreated(() => {
  let templateObject = Template.instance();
  templateObject.restorerecords = new ReactiveVar();
});
Template.backuprestore.onRendered(function(){
  $('.fullScreenSpin').css('display', 'inline-block');
  let templateObject = Template.instance();
  let backupService = new TaxRateService();
  var erpGet = erpDb();

  const restoreList = [];
  var erpGet = erpDb();
  let objDetails = {
      name: "VS1_BackupList",
      databasename:erpGet.ERPDatabase,
      AllDBBackups:true
  };
  var myString = '"jsonin"'+':'+JSON.stringify(objDetails);

  var oPost = new XMLHttpRequest();
  oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name=VS1_BackupList', true);
  oPost.setRequestHeader("database",'vs1_clientdb_admin');
  oPost.setRequestHeader("username",'VS1_Cloud_Admin');
  oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
  oPost.setRequestHeader("Accept", "application/json");
  oPost.setRequestHeader("Accept", "application/html");
  oPost.setRequestHeader("Content-type", "application/json");

  oPost.send(myString);
  oPost.onreadystatechange = function() {
  if(oPost.readyState == 4 && oPost.status == 200) {

     $('.fullScreenSpin').css('display','none');
     var myArrResponse = JSON.parse(oPost.responseText);
     if(myArrResponse.ProcessLog.Error){
       swal('Oooops...', myArrResponse.ProcessLog.Error, 'error');
     }else{
       let data = myArrResponse.ProcessLog.BackupList.Files;

       for (let i in data) {
         let segData = data[i].FileName.split('Backup_');
         let getDateTime = segData[1].replace('.7z', '') || '';
         let segGetDateTime = getDateTime.split('_');
         let getDataDate = segGetDateTime[0];
         let geDateTime = segGetDateTime[1].replace('-', ':');

         var dateFormat = new Date(getDataDate+':'+geDateTime);

         let getFormatValue = moment(dateFormat).format("ddd MMM D, YYYY, HH:mm:ss");
         //dateFormat.getDate() + " " + (dateFormat.getMonth() + 1) + "," + dateFormat.getFullYear();


           let recordObj = {
               filename: data[i].FileName || ' ',
               formateedname:getFormatValue||'',
               sortdatename:dateFormat||''
           };
           restoreList.push(recordObj);

       }
       templateObject.restorerecords.set(restoreList);
       $('.fullScreenSpin').css('display','none');

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

   swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }else{

   swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }

  }else if(oPost.readyState == '') {
  $('.fullScreenSpin').css('display','none');

  swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
  }
 }
/*
  backupService.pullBackupData(myString).then(function (objDetails) {
    let data = objDetails.ProcessLog.BackupList.Files;

    for (let i in data) {
      let segData = data[i].FileName.split('Backup_');
      let getDateTime = segData[1].replace('.7z', '') || '';
      let segGetDateTime = getDateTime.split('_');
      let getDataDate = segGetDateTime[0];
      let geDateTime = segGetDateTime[1].replace('-', ':');

      var dateFormat = new Date(getDataDate+':'+geDateTime);

      let getFormatValue = moment(dateFormat).format("ddd MMM D, YYYY, HH:mm:ss");
      //dateFormat.getDate() + " " + (dateFormat.getMonth() + 1) + "," + dateFormat.getFullYear();


        let recordObj = {
            filename: data[i].FileName || ' ',
            formateedname:getFormatValue||'',
            sortdatename:dateFormat||''
        };
        restoreList.push(recordObj);

    }
    templateObject.restorerecords.set(restoreList);
    $('.fullScreenSpin').css('display','none');
    // var myArrResponse = JSON.parse(objDetails);
  }).catch(function (err) {
      swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
      }).then((result) => {
          if (result.value) {

          } else if (result.dismiss === 'cancel') {

          }
      });

      $('.fullScreenSpin').css('display','none');
  });

*/

});
Template.backuprestore.events({
'click .btnRestore': function () {
  let backupService = new TaxRateService();
  var erpGet = erpDb();
  $('.fullScreenSpin').css('display','inline-block');
  let restorePoint = $('.sltRestorePoint').val()||'';

  let objDetails = {
      Name: "VS1_DatabaseRestore",
      Params: {
        ArchiveName: restorePoint||'',
        BackupFirst:true
    }
  };
  var myString = '"JsonIn"'+':'+JSON.stringify(objDetails);
  var erpGet = erpDb();

  var oPost = new XMLHttpRequest();
  oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name=VS1_DatabaseRestore', true);
  oPost.setRequestHeader("database",'vs1_clientdb_admin');
  oPost.setRequestHeader("username",'VS1_Cloud_Admin');
  oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
  oPost.setRequestHeader("Accept", "application/json");
  oPost.setRequestHeader("Accept", "application/html");
  oPost.setRequestHeader("Content-type", "application/json");

  oPost.send(myString);
  oPost.onreadystatechange = function() {
  if(oPost.readyState == 4 && oPost.status == 200) {

     $('.fullScreenSpin').css('display','none');
     var myArrResponse = JSON.parse(oPost.responseText);
     if(myArrResponse.ProcessLog.Error){
       swal('Oooops...', myArrResponse.ProcessLog.Error, 'error');
     }else{
       let dataSuccess = myArrResponse.ProcessLog.ResponseStatus;
       swal({
       title: dataSuccess,
       text: '',
       type: 'success',
       showCancelButton: false,
       confirmButtonText: 'OK'
       }).then((result) => {
         window.open('/backuprestore','_self');
       });

       $('.fullScreenSpin').css('display','none');

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

   swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }else{

   swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }

  }else if(oPost.readyState == '') {
  $('.fullScreenSpin').css('display','none');

  swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
  }
 }
  /*
  backupService.restoreBackupData(myString).then(function (objDetails) {
    window.open('/backuprestore','_self');
  }).catch(function (err) {
      swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
      }).then((result) => {
          if (result.value) {

          } else if (result.dismiss === 'cancel') {

          }
      });

      $('.fullScreenSpin').css('display','none');
  });
  */
},'click .btnCreateBackup': function () {
  let backupService = new TaxRateService();
  $('.fullScreenSpin').css('display','inline-block');
  var erpGet = erpDb();
  let objDetails = {
      name: "VS1_DatabaseBackup",
      databasename:erpGet.ERPDatabase,
  };
  var myString = '"JsonIn"'+':'+JSON.stringify(objDetails);


  var oPost = new XMLHttpRequest();
  oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name=VS1_DatabaseRestore', true);
  oPost.setRequestHeader("database",'vs1_clientdb_admin');
  oPost.setRequestHeader("username",'VS1_Cloud_Admin');
  oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
  oPost.setRequestHeader("Accept", "application/json");
  oPost.setRequestHeader("Accept", "application/html");
  oPost.setRequestHeader("Content-type", "application/json");

  oPost.send(myString);
  oPost.onreadystatechange = function() {
  if(oPost.readyState == 4 && oPost.status == 200) {

     $('.fullScreenSpin').css('display','none');
     var myArrResponse = JSON.parse(oPost.responseText);
     if(myArrResponse.ProcessLog.Error){
       swal('Oooops...', myArrResponse.ProcessLog.Error, 'error');
     }else{
       let dataSuccess = myArrResponse.ProcessLog.ResponseStatus;
       swal({
       title: dataSuccess,
       text: '',
       type: 'success',
       showCancelButton: false,
       confirmButtonText: 'OK'
       }).then((result) => {
         window.open('/backuprestore','_self');
       });

       $('.fullScreenSpin').css('display','none');

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

   swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }else{

   swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
  }

  }else if(oPost.readyState == '') {
  $('.fullScreenSpin').css('display','none');

  swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
  }
 }
  /*
  backupService.saveBackupData(myString).then(function (objDetails) {
    window.open('/backuprestore','_self');
  }).catch(function (err) {
      swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
      }).then((result) => {
          if (result.value) {

          } else if (result.dismiss === 'cancel') {

          }
      });

      $('.fullScreenSpin').css('display','none');
  });
  */
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
}
});
Template.backuprestore.helpers({
  restorerecords: () => {
      return Template.instance().restorerecords.get().sort((a, b) => {
  const aDate = new Date(a.sortdatename)
  const bDate = new Date(b.sortdatename)

  return bDate.getTime() - aDate.getTime()
});
  }
});
