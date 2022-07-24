import {ReactiveVar} from 'meteor/reactive-var';
import { SMSService } from '../../js/sms-settings-service';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';

let sideBarService = new SideBarService();
let smsService = new SMSService();

Template.smssettings.onCreated(() => {
  const templateObject = Template.instance();
  templateObject.smsSettingDetails = new ReactiveVar([]);
  templateObject.saveSettingObject = async function(data) {
    return new Promise((resolve) => {
      const oldSetting = templateObject.smsSettingDetails.get().filter((field) => field.PrefName === data.eKey);
      let settingObject = {};
      if (oldSetting.length > 0) {
        settingObject = {
          type: "TERPPreference",
          fields: {
            Id: oldSetting[0].Id,
            Fieldvalue: data.Fieldvalue
          }
        }
      } else {
        settingObject = {
          type: "TERPPreference",
          fields: {
            DefaultValue: "",
            FieldType: "ftString",
            FieldValue: data.Fieldvalue,
            KeyValue: data.KeyValue,
            PrefName: data.eKey,
            PrefType: "ptCompany",
            RefType: "None"
          }
        };
      }
      smsService.saveSMSSettings(settingObject).then((res) => {
        sideBarService.getGlobalSettings().then(function(data) {
          addVS1Data('TERPPreference', JSON.stringify(data)).then(() => {
            resolve({success: true, ...res});
          }).catch(function (err) {resolve({success: false, ...err})});
        });
      }).catch(err => resolve({success: false, ...err}));
    });
  }
});

Template.smssettings.onRendered(function () {
  $('.fullScreenSpin').css('display','inline-block');

  const templateObject = Template.instance();
  const smsSettings = {
    twilioAccountId: "",
    twilioAccountToken: "",
    twilioTelephoneNumber: "",
    startAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we are on site and doing the following service [Product/Service].",
    saveAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] confirming that we are booked in to be at [Full Address] at [Booked Time] to do the following service [Product/Service]. Please reply with Yes to confirm this booking or No if you wish to cancel it.",
    stopAppointmentSMSMessage: "Hi [Customer Name], This is [Employee Name] from [Company Name] just letting you know that we have finished doing the following service [Product/Service]."
  }
  smsService.getSMSSettings().then((result) => {
    $('.fullScreenSpin').css('display','none');
    if (result.terppreference.length > 0) {
      templateObject.smsSettingDetails.set(result.terppreference);
      for (let i = 0; i < result.terppreference.length; i++) {
        switch(result.terppreference[i].PrefName) {
          case "VS1SMSID": smsSettings.twilioAccountId = result.terppreference[i].Fieldvalue || smsSettings.twilioAccountId; break;
          case "VS1SMSToken": smsSettings.twilioAccountToken = result.terppreference[i].Fieldvalue || smsSettings.twilioAccountToken; break;
          case "VS1SMSPhone": smsSettings.twilioTelephoneNumber = result.terppreference[i].Fieldvalue || smsSettings.twilioTelephoneNumber; break;
          case "VS1SAVESMSMSG": smsSettings.saveAppointmentSMSMessage = result.terppreference[i].Fieldvalue || smsSettings.saveAppointmentSMSMessage; break;
          case "VS1STARTSMSMSG": smsSettings.startAppointmentSMSMessage = result.terppreference[i].Fieldvalue || smsSettings.startAppointmentSMSMessage; break;
          case "VS1STOPSMSMSG": smsSettings.stopAppointmentSMSMessage = result.terppreference[i].Fieldvalue || smsSettings.stopAppointmentSMSMessage;
        }
      }

      $('#twilioAccountId').val(smsSettings.twilioAccountId);
      $('#twilioAccountToken').val(smsSettings.twilioAccountToken);
      $('#twilioTelephoneNumber').val(smsSettings.twilioTelephoneNumber);
      $('#saveAppointmentSMS').val(smsSettings.saveAppointmentSMSMessage);
      $('#startAppointmentSMS').val(smsSettings.startAppointmentSMSMessage);
      $('#stopAppointmentSMS').val(smsSettings.stopAppointmentSMSMessage);

    }
  }).catch((error) => {
    console.log(error);
    window.open('/settings', '_self');
  });

});

Template.smssettings.events({
  'click #twilioSignUp': function() {
    window.open("https://twilio.com/try-twilio");
  },
  'click #saveTwilioSettings': async function() {
    $('.fullScreenSpin').css('display','inline-block');

    const templateObject = Template.instance();

    //TODO: Save SMS Settings with API
    const allKeys = ["VS1SMSID", "VS1SMSToken", "VS1SMSPhone", "VS1SAVESMSMSG", "VS1STARTSMSMSG", "VS1STOPSMSMSG"];
    for (const eKey of allKeys) {
      let value = '';
      let tag = '';
      switch (eKey) {
        case "VS1SMSID": value = $('#twilioAccountId').val(); tag = "sid,twilliotoken,phone"; break;
        case "VS1SMSToken": value = $('#twilioAccountToken').val(); tag = "sid,twilliotoken,phone"; break;
        case "VS1SMSPhone": value = $('#twilioTelephoneNumber').val(); tag = "sid,twilliotoken,phone"; break;
        case "VS1SAVESMSMSG": value = $('#saveAppointmentSMS').val(); break;
        case "VS1STARTSMSMSG": value = $('#startAppointmentSMS').val(); break;
        case "VS1STOPSMSMSG": value = $('#stopAppointmentSMS').val();
      }
      const data = {
        eKey,
        Fieldvalue: value,
        KeyValue: tag
      }
      await templateObject.saveSettingObject(data);
    }
    $('.fullScreenSpin').css('display','none');
    swal({
      title: 'SMS settings successfully updated!',
      text: '',
      type: 'success',
      showCancelButton: false,
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.value) {
        window.open('/settings','_self');
      } else if (result.dismiss === 'cancel') {}
    });
  }
});
