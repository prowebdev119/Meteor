import {
    OrganisationService
} from '../../js/organisation-service';
import {
    CountryService
} from '../../js/country-service';
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();


Template.subscriptionSettings.onCreated(() => {});

Template.subscriptionSettings.onRendered(function() {
    $('.fullScreenSpin').css('display', 'inline-block');
    $.ajax({
        url: stripeGlobalURL +'vs1_get-payment_method.php',
        //url: 'https://depot.vs1cloud.com/stripe/vs1_get-payment_method.php',
        data: {
            'email': Session.get('VS1AdminUserName'),
        },
        method: 'post',
        success: function(response) {
            let response2 = JSON.parse(response);
            if (response2 != null) {
                let month = response2.card.exp_month;
                let year = response2.card.exp_year;
                // $('#txtCardID').val(data.tvs1_clients_simple[0].fields.ID||'');
                $('#txtCardNo').val("**** **** **** " + response2.card.last4);
                $('#txtExpireDate').val(month + "/" + year);
                $('#txtCVC').val("***");
                $('.fullScreenSpin').css('display', 'none');
            } else {
                 $('.fullScreenSpin').css('display', 'none');
            }
        }
    });
    // var erpGet = erpDb();
    // var oReq = new XMLHttpRequest();
    // oReq.open("GET", URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/TVS1_Clients_Simple?ListType="Detail"&select=[Databasename]="' + erpGet.ERPDatabase + '"', true);
    // oReq.setRequestHeader("database", vs1loggedDatatbase);
    // oReq.setRequestHeader("username", 'VS1_Cloud_Admin');
    // oReq.setRequestHeader("password", 'DptfGw83mFl1j&9');
    // oReq.send();
    // oReq.onreadystatechange = function () {
    //     if (oReq.readyState == 4 && oReq.status == 200) {
    //         var data = JSON.parse(oReq.responseText);
    //         $('#txtCardID').val(data.tvs1_clients_simple[0].fields.ID || '');
    //     }
    // }
});

Template.subscriptionSettings.events({
    'click .btnBack': function(event) {
        event.preventDefault();
        history.back();
    },
    'click .btnAddVS1User': function(event) {
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
    'click .btnCancelSub': function(event) {
        let loggeduserEmail = localStorage.getItem('mySession');
        let loggeduserName = Session.get('mySessionEmployee');
        let currentURL = FlowRouter.current().queryParams;
        swal({
            title: 'Are you sure you want to cancel this subscription?',
            text: '',
            type: 'question',
            showCancelButton: true,
            // cancelButtonClass: "btn-success",
            cancelButtonClass: "btn-danger",
            confirmButtonText: 'No',
            cancelButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {} else if (result.dismiss === 'cancel') {

                swal({
                    title: 'Reason For Cancellation?',
                    text: "Sorry to see you go, please comment below the reason you want to go.",
                    input: 'textarea',
                    inputAttributes: {
                        id: 'edtFeedback',
                        name: 'edtFeedback'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    showLoaderOnConfirm: true
                }).then((inputValue) => {
                    if (inputValue.value === "") {
                        swal({
                            title: 'Successfully Cancel Your Subscription',
                            text: '',
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.value) {
                                window.open('https://www.depot.vs1cloud.com/vs1subscription/cancelsubscription.php?email=' + loggeduserEmail + '', '_self');
                            } else if (result.dismiss === 'cancel') {}
                        });
                    } else if (inputValue.value != "") {
                        var htmlmailBody = '<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">' +
                            '    <tr>' +
                            '        <td style="display: block; margin: 0 auto !important; max-width: 650px; padding: 10px; width: 650px;">' +
                            '            <div style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 650px; padding: 10px;">' +
                            '                <table>' +
                            '                    <tr>' +
                            '                        <td>' +
                            '                            <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
                            '                                <tr>' +
                            '                                    <td style="text-align: center; letter-spacing: 2px;">' +
                            '                                        <span style="color: #999999; font-size: 12px; text-align: center; margin: 0 auto; text-transform: uppercase;">Account Cancellation Notice</span>' +
                            '                                    </td>' +
                            '                                </tr>' +
                            '                                <tr style="height: 16px;"></tr>' +
                            '                                <tr style="width: 100%;">' +
                            '                                    <td style="width: 100%;">' +
                            '                                        <img src="https://sandbox.vs1cloud.com/assets/VS1logo.png" style="border: none; max-width: 75%; margin-left: 10%;" />' +
                            '                                    </td>' +
                            '                                </tr>' +
                            '                                <tr style="height: 48px;"></tr>' +
                            '                                <tr style="background-color: rgba(0, 163, 211, 0.5); ">' +
                            '                                    <td style="text-align: center;padding: 32px 16px;">' +
                            '                                        <p style="font-weight: 700; font-size: 36px; color: #363a3b;">Your account has been canceled. We\'re really sorry to see you go.</p>' +
                            '                                    </td>' +
                            '                                </tr>' +
                            '                                <tr>' +
                            '                                    <td style="padding: 16px 32px 0px 32px;">' +
                            '                                        <p style="font-size: 18px;">Hi ' + loggeduserName + ',</p>' +
                            '                                        <p style="font-size: 18px; margin: 34px 0px;">This email confirms that your VS1 Cloud account has been canceled. We\'re really sorry to see you go, but thaks for giving us a try.</p>' +
                            '                                        <p style="font-size: 18px; margin: 34px 0px;">Your account will remain active until the end of the month.</p>' +
                            '                                    </td>' +
                            '                                </tr>' +
                            '                                <tr>' +
                            '                                    <td style="padding: 0px 32px 16px 32px;">' +
                            '                                        <p style="font-size: 24px; font-weight: 700;">Made a mistake? Having second thoughts?</p>' +
                            '                                        <p style="font-size: 18px; margin: 34px 0px;">If you believe this cancellation is an error, or you have any other questions about your account, please visit: <a href="https://vs1cloud.com/contact.php">www.vs1cloud.com/contact</a></p>' +
                            '                                    </td>' +
                            '                                </tr>' +
                            '                            </table>' +
                            '                        </td>' +
                            '                    </tr>' +
                            '                </table>' +
                            '                <div style="clear: both; margin-top: 10px; text-align: center; width: 100%;">' +
                            '                    <table border="0" cellpadding="0" cellspacing="0" style="width: 100%;">' +
                            '                        <tr>' +
                            '                            <td style="color: #999999; font-size: 12px; text-align: center;">' +
                            '                                <span style="color: #999999; font-size: 12px; text-align: center;">VS1 Cloud</span>' +
                            '                                <br>' +
                            '                                <a href="https://vs1cloud.com/downloads/VS1%20Privacy%20ZA.pdf" style="color: #999999; font-size: 12px; text-align: center;">Privacy</a>' +
                            '                                <a href="https://vs1cloud.com/downloads/VS1%20Terms%20ZA.pdf" style="color: #999999; font-size: 12px; text-align: center;">Terms of Service</a>' +
                            '                            </td>' +
                            '                        </tr>' +
                            '                    </table>' +
                            '                </div>' +
                            '            </div>' +
                            '        </td>' +
                            '    </tr>' +
                            '</table>';

                        Meteor.call('sendEmail', {
                            from: "VS1 Cloud <info@vs1cloud.com>",
                            to: loggeduserEmail,
                            subject: 'VS1 Cloud - Account Cancellation Notice',
                            text: '',
                            html: htmlmailBody
                        }, function(error, result) {});

                        Meteor.call('sendEmail', {
                            from: "VS1 Cloud <info@vs1cloud.com>",
                            to: 'info@vs1cloud.com',
                            subject: loggeduserEmail + ': Reason For Cancellation',
                            text: inputValue.value,
                            html: ''
                        }, function(error, result) {});

                        swal({
                            title: 'Successfully Cancel Your Subscription',
                            text: 'Thank you for the Feedback, We will work on solving the issue',
                            type: 'success',
                            showCancelButton: false,
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.value) {
                                window.open('https://www.depot.vs1cloud.com/vs1subscription/cancelsubscription.php?email=' + loggeduserEmail + '', '_self');
                            } else if (result.dismiss === 'cancel') {}
                        });

                    } else {}

                });

            }
        });
    },
    // 'click .btnSaveCreditCard': function (event) {
    // let lineID = $('#txtCardID').val();
    // $('.fullScreenSpin').css('display', 'inline-block');
    // let objDetails = {
    //     type: "TVS1_Clients_Simple",
    //     fields: {
    //       ID: parseInt(lineID)||0,
    //       CreditCardCVC:$('#txtCVC').val(),
    //       CreditCardNumber: $('#txtCardNo').val()
    //       // VS1UserName: erpGet.ERPUsername,
    //       // VS1Password: erpGet.ERPPassword,
    //       // APIPort:parseFloat(portNo)||0
    //   }
    // };
    //   var oPost = new XMLHttpRequest();
    //   oPost.open("POST",URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/TVS1_Clients_Simple', true);
    //   oPost.setRequestHeader("database",vs1loggedDatatbase);
    //   oPost.setRequestHeader("username",'VS1_Cloud_Admin');
    //   oPost.setRequestHeader("password",'DptfGw83mFl1j&9');
    //   oPost.setRequestHeader("Accept", "application/json");
    //   oPost.setRequestHeader("Accept", "application/html");
    //   oPost.setRequestHeader("Content-type", "application/json");
    //   //var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);
    //   var myString = JSON.stringify(objDetails);
    //   if(lineID != ''){
    //    oPost.send(myString);

    //    oPost.onreadystatechange = function() {
    // if(oPost.readyState == 4 && oPost.status == 200) {

    //     $('.fullScreenSpin').css('display','none');
    //   window.open('/subscriptionSettings','_self');

    // }else if(oPost.readyState == 4 && oPost.status == 403){
    // $('.fullScreenSpin').css('display','none');
    // swal({
    // title: 'Oooops...',
    // text: oPost.getResponseHeader('errormessage'),
    // type: 'error',
    // showCancelButton: false,
    // confirmButtonText: 'Try Again'
    // }).then((result) => {
    // if (result.value) {
    // // Meteor._reload.reload();
    // } else if (result.dismiss === 'cancel') {

    // }
    // });
    // }else if(oPost.readyState == 4 && oPost.status == 406){
    //   $('.fullScreenSpin').css('display','none');
    //   var ErrorResponse = oPost.getResponseHeader('errormessage');
    //   var segError = ErrorResponse.split(':');

    // if((segError[1]) == ' "Unable to lock object'){

    //   swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
    // }else{

    //   swal('WARNING', oPost.getResponseHeader('errormessage')+'Please try again!', 'error');
    // }

    // }else if(oPost.readyState == '') {
    // $('.fullScreenSpin').css('display','none');

    // swal('Connection Failed', oPost.getResponseHeader('errormessage') +' Please try again!', 'error');
    // }
    // }
    //   }else{
    //     window.open('/subscriptionSettings','_self');
    //   }
    // },
    'click .btnSaveCreditCard': function(event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        let cardnumber = $('#txtCardNo').val();
        let month = $('#txtExpireDate').val().split('/')[0];
        let year = $('#txtExpireDate').val().split('/')[1];
        let cvc = $('#txtCVC').val();

        $.ajax({
            //url: 'https://depot.vs1cloud.com/stripe-sandbox/vs1_update-payment_method.php',
            url: 'https://depot.vs1cloud.com/stripe/vs1_update-payment_method.php',
            data: {
                'email': Session.get('VS1AdminUserName'),
                'cardnumber': cardnumber,
                'month': month,
                'year': year,
                'cvc': cvc
            },
            method: 'post',
            success: function(response) {
                let response2 = JSON.parse(response);
                if (response2 != null) {

                    let lineID = $('#txtCardID').val();
                    let objDetails = {
                        type: "TVS1_Clients_Simple",
                        fields: {
                            ID: parseInt(lineID) || 0,
                            CreditCardCVC: $('#txtCVC').val(),
                            CreditCardNumber: $('#txtCardNo').val()
                            // VS1UserName: erpGet.ERPUsername,
                            // VS1Password: erpGet.ERPPassword,
                            // APIPort:parseFloat(portNo)||0
                        }
                    };
                    var oPost = new XMLHttpRequest();
                    oPost.open("POST", URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/TVS1_Clients_Simple', true);
                    oPost.setRequestHeader("database", vs1loggedDatatbase);
                    oPost.setRequestHeader("username", 'VS1_Cloud_Admin');
                    oPost.setRequestHeader("password", 'DptfGw83mFl1j&9');
                    oPost.setRequestHeader("Accept", "application/json");
                    oPost.setRequestHeader("Accept", "application/html");
                    oPost.setRequestHeader("Content-type", "application/json");
                    //var myString = '"JsonIn"'+':'+JSON.stringify(objDetailsUser);
                    var myString = JSON.stringify(objDetails);
                    if (lineID != '') {
                        oPost.send(myString);

                        oPost.onreadystatechange = function() {
                            if (oPost.readyState == 4 && oPost.status == 200) {

                                $('.fullScreenSpin').css('display', 'none');
                                window.open('/subscriptionSettings', '_self');

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
                                        // Meteor._reload.reload();
                                    } else if (result.dismiss === 'cancel') {}
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
                        window.open('/subscriptionSettings', '_self');
                    }
                } else {
                    $('.fullScreenSpin').css('display', 'none');
                    swal({
                        title: 'Oops...',
                        text: "Something went wrong, please try again later",
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    });
                }
            }
        });

    }
});
