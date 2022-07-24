Template.appAlertPage.onCreated(function(){


});

Template.appAlertPage.onRendered(function(){
  $("#resubmitLogin").click(function(e){
    var password = $("#erppassword").val();
    var entpassword = CryptoJS.MD5(password).toString().toUpperCase();
    var userPassword = Session.get('myerpPassword');
    if(password.toUpperCase() == userPassword.toUpperCase()){
      document.getElementById('apptimer').style.display='none';
    }else{

      swal('Invalid VS1 Password', 'The entered user password is not correct, please re-enter your password and try again!', 'error');
      $("#erppassword").focus();
    }
    e.preventDefault();
  });

  $("#erppassword").keyup(function (e) {
      if (e.keyCode == 13) {
          $("#resubmitLogin").trigger("click");
      }
  });

  $(".btnLogOut").click(function(e){
    window.open('/', '_self');
  });

});
