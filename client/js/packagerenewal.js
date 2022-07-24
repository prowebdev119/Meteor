import {Mongo} from 'meteor/mongo';

Template.packagerenewal.onCreated(function() {

  // Meteor.call('sendEmail', {
  //     from: "VS1 Cloud <info@vs1cloud.com>",
  //     to: 'rasheed@trueerp.com',
  //
  //     subject: '[VS1 Cloud] - Licence Renewal',
  //     text: "Test Render",
  //     html:'',
  //     attachments : ''
  //
  // }, function (error, result) {
  //
  // });
});


Template.packagerenewal.onRendered(function() {
  const templateObject = Template.instance();
  Meteor.call('sendEmail',{
      to: 'rasheed@vs1cloud.com',
      from: 'info@vs1cloud.com',
      subject: 'Rasheed Test!',
      text: 'eeeeeeeeeeeeee8888eeeeeeee!',
      html: 'With meteor it&apos;s easy to set up <strong>HTML</strong> <span style="color:red">emails</span> too.'
      }, function (error, result) {

      });

  let currentURL = FlowRouter.current().queryParams;
  Meteor.call('magentoAWSProfileRenewal', function(error, result) {
    if (error) {

    } else {
      if (result) {

        let valueData = result.items;
        for (let j in valueData) {
          if (valueData[j].status == "active") {
            if (valueData[j].created_at.split(' ')[0] != valueData[j].last_order_date.split(' ')[0]) {
              var currentDate = new Date();
              var renewCurrentDate = moment(currentDate).format("YYYY-MM-DD");
              let lastOrderDate = valueData[j].last_order_date.split(' ')[0];

              let customerEmail = valueData[j].customer_email;
              let paymentMethod = valueData[j].payment_method;
              let paymentAmount = valueData[j].regular_subtotal;


    if (lastOrderDate === renewCurrentDate) {
              let objDetails = {
                Name: "VS1_Renew",
                Params: {
                  CloudUserName: customerEmail,

                  Paymentamount: parseFloat(paymentAmount) || 0,
                  PayMethod: paymentMethod,
                }
              };

              var erpGet = erpDb();
              var oPost = new XMLHttpRequest();
              var serverIP = licenceIPAddress;
              var port = checkSSLPorts;
              oPost.open("POST", URLRequest + serverIP + ':' + port + '/' + 'erpapi' + '/' + 'VS1_Cloud_Task/Method?Name="VS1_Renew"', true);
              oPost.setRequestHeader("database", vs1loggedDatatbase);
              oPost.setRequestHeader("username", "VS1_Cloud_Admin");
              oPost.setRequestHeader("password", "DptfGw83mFl1j&9");
              oPost.setRequestHeader("Accept", "application/json");
              oPost.setRequestHeader("Accept", "application/html");
              oPost.setRequestHeader("Content-type", "application/json");

              var myString = JSON.stringify(objDetails);
              oPost.send(myString);
              oPost.onreadystatechange = function() {

                if (oPost.readyState == 4 && oPost.status == 200) {

                  Meteor.call('sendEmail', {
                      from: "VS1 Cloud <info@vs1cloud.com>",
                      to: 'rasheed@trueerp.com',

                      subject: '[VS1 Cloud] - Licence Renewal',
                      text: customerEmail,
                      html:'',
                      attachments : ''

                  }, function (error, result) {

                  });

                  var myArrResponse = JSON.parse(oPost.responseText);

                  if (myArrResponse.ProcessLog.Error) {



                  } else {
                    var databaseName = myArrResponse.ProcessLog.Databasename;

                  }

                } else if (oPost.readyState == 4 && oPost.status == 403) {

                } else if (oPost.readyState == 4 && oPost.status == 406) {

                  var ErrorResponse = oPost.getResponseHeader('errormessage');
                  var segError = ErrorResponse.split(':');

                  if ((segError[1]) == ' "Unable to lock object') {



                  } else {


                  }

                } else if (oPost.readyState == '') {

                }

              }



              }

            }

          }

        }
      }

    }
  });

  let userEmail = '';
  let cloudpassword = '';

  if ((currentURL.passkey) && (currentURL.emailakey)) {
    userEmail = currentURL.emailakey;
    cloudpassword = currentURL.passkey;
    $('#emEmail').html(currentURL.emailakey);
    $('#emPassword').html(currentURL.passkey);
    let paymentAmount = currentURL.pricetopay;
    let objDetails = {
      Name: "VS1_Renew",
      Params: {
        CloudUserName: userEmail,
        CloudPassword: cloudpassword,
        Paymentamount: parseFloat(paymentAmount) || 1000,
        Paymethod: "Cash",
      }
    };

    var erpGet = erpDb();
    var oPost = new XMLHttpRequest();
    var serverIP = licenceIPAddress;
    var port = checkSSLPorts;
    oPost.open("POST", URLRequest + serverIP + ':' + port + '/' + 'erpapi' + '/' + 'VS1_Cloud_Task/Method?Name="VS1_Renew"', true);
    oPost.setRequestHeader("database", vs1loggedDatatbase);
    oPost.setRequestHeader("username", "VS1_Cloud_Admin");
    oPost.setRequestHeader("password", "DptfGw83mFl1j&9");
    oPost.setRequestHeader("Accept", "application/json");
    oPost.setRequestHeader("Accept", "application/html");
    oPost.setRequestHeader("Content-type", "application/json");

    var myString = JSON.stringify(objDetails);
    oPost.send(myString);
    oPost.onreadystatechange = function() {

      if (oPost.readyState == 4 && oPost.status == 200) {

        var myArrResponse = JSON.parse(oPost.responseText);

        if (myArrResponse.ProcessLog.Error) {

          swal('Database Error', myArrResponse.ProcessLog.Error, 'error');

        } else {
          var databaseName = myArrResponse.ProcessLog.Databasename;

          localStorage.usremail = userEmail;
          localStorage.usrpassword = cloudpassword;
          //window.open('/','_self');
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

          } else if (result.dismiss === 'cancel') {

          }
        });
      } else if (oPost.readyState == 4 && oPost.status == 406) {
        $('.fullScreenSpin').css('display', 'none');
        var ErrorResponse = oPost.getResponseHeader('errormessage');
        var segError = ErrorResponse.split(':');

        if ((segError[1]) == ' "Unable to lock object') {


          swal('WARNING', oPost.getResponseHeader('errormessage') + 'Please try again!', 'error');
        } else {

          swal('WARNING', oPost.getResponseHeader('errormessage') + 'Please try again!', 'error');
        }

      } else if (oPost.readyState == '') {
        $('.fullScreenSpin').css('display', 'none');

        swal('Connection Failed', oPost.getResponseHeader('errormessage') + ' Please try again!', 'error');
      }

    }
  } else {

  }

});
