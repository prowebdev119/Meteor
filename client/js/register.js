import { Mongo } from 'meteor/mongo';
if (Meteor.isClient) {

Template.register.events({
  'submit .addRegisterForm' : function (event, template) {

   event.preventDefault();
   var serverIP = event.target.Server.value;
   var databaseName = event.target.Database.value;
   var userName = event.target.Username.value;
   var userEmail = event.target.Useremail.value;
   var password = event.target.Password.value;
   var cloudpassword = event.target.CloudPassword.value;
   var cloudHashPassword = CryptoJS.MD5(cloudpassword).toString().toUpperCase();
   var port = event.target.Port.value;
   var description = event.target.Description.value;
   var emailAlreadyExist  = CloudUser.find({cloudEmail: userEmail}).fetch();
  if(cloudpassword.length < 8) {
    Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
    $('.CloudPassword').css('border-color','red');
    $('.CloudPassword').focus();

  }else{
    if((cloudpassword.match(/[A-z]/)) && (cloudpassword.match(/[A-Z]/)) && (cloudpassword.match(/\d/))){

      $('.CloudPassword').css('border-color','#b5b8bb #e2e4e7 #e8eaec #bdbfc3');
      if (emailAlreadyExist.length > 0) {
        Bert.alert('<strong>Error:</strong> Email already registered!', 'warning');
       }else{
         CloudDatabase.insert({ server: serverIP,database:databaseName,username:userName,useremail:userEmail,password:password,port:port,description:description,createdAt: new Date() }, function(err, idTag) {
           if (err) {

           } else {

             CloudUser.insert({ clouddatabaseID:idTag,cloudEmail:userEmail,cloudUsername:userName,cloudPassword:cloudpassword,cloudHashPassword:cloudHashPassword,server: serverIP,database:databaseName,username:userName,password:password,port:port,userMultiLogon:false,createdAt: new Date() });
           }
         });

      Bert.alert('<strong>Success:</strong> New server connection details successfully created!', 'success');
      document.getElementById("addRegisterForm").reset();
       }
    } else {
      Bert.alert('<strong>Error: Invalid VS1 Password</strong> must be at least eight characters including one capital letter, one number and one special characters [! @ # $ % ^ & *] !', 'danger');
      $('.CloudPassword').css('border-color','red');
      $('.CloudPassword').focus();
    }
  }
 }
});
}

Template.register.helpers({
    regAdd: function(){
       return CloudDatabase.find();
    }
});

Template.register.onRendered( function() {

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
});

});
