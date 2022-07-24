FutureTasks = new Meteor.Collection('email_settings');

Meteor.startup(function(){
    if (Meteor.isServer) {
      process.env.MAIL_URL='smtps://noreply%40vs1cloud.com:Jp9CvV2M5g@mail.vs1cloud.com:465/';
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

      var minutesToAdd=2;
      var currentDate = new Date();
      var futureDate = new Date(currentDate.getTime() + minutesToAdd*60000);
      
      // FutureTasks.insert({
      //   to: 'silvertiger0321@gmail.com',
      //   from: 'noreply@vs1cloud.com',
      //   subject: 'Test',
      //   text: 'This is test email for synced cron job',
      //   html: '<p>Test</p>',
      //   schedule_id: '1',
      //   date: futureDate
      // })

      // FutureTasks.remove({});
      // SyncedCron.remove(1);

      FutureTasks.find().forEach(function(mail) {
        // console.log(mail)
        // console.log(mail.date);
        if (mail.date < new Date()) {
          Meteor.call('sendEmail', mail);
        } else {
          Meteor.call('addTask', mail.schedule_id, mail);
        }
      });
      SyncedCron.start();
    }

});

Meteor.methods({
  authCall: function () {
    this.unblock();
    var auth_url="https://192.168.1.100:4433/erpapi/TERPSysInfo";
    return Meteor.http.call("GET", auth_url, {

      headers: {
        'database':'vs1_cloud',
        'username':'VS1_Cloud_Admin',
        'password':'DptfGw83mFl1j&9',
        "content-type":"application/json",
        "Accept":"application/json"
      },
      strictSSL: false
    })
  },
  sendEmail: function (details) {
    // console.log(details);
    // check([mailFields.to, mailFields.from, mailFields.subject, mailFields.text, mailFields.html], [String]);
    this.unblock();
    if(details.attachments === undefined){
        details.attachments = [];
    }else{

    }
    let frequencyType = '';
    if (details.Frequency === 'M') frequencyType = 'Monthly';
    else if (details.Frequency === 'W') frequencyType = 'Weekly';
    else if (details.Frequency === 'D') frequencyType = 'Daily';
    else if (details.Frequency === '' && details.Active) frequencyType = 'One Time Only';

    SSR.compileTemplate("emailtemplate", Assets.getText('email/templates/reportemail.html'));
    const groupedReports = Meteor.call('groupedReports', details.FormID, details.FormIDs ? details.FormIDs.split(',') : [], details.HostURL);
    // console.log(groupedReports);
    const html = SSR.render("emailtemplate", {groupedReports, name: details.FormName, isGrouped: details.FormID == '1'});

    try {
      Email.send({
        to: details.EmployeeEmail,
        // to: 'silvertiger0321@gmail.com',
        from: 'noreply@vs1cloud.com',
        cc: '',
        subject: 'Report Email',
        text: 'mailFields.text',
        html: html,
        attachments: details.attachments
      });
    } catch(e) {
        if (e) {
            throw new Meteor.Error("error", e.response);
        }
    }
  },
  addTask: function(details) {
    if (details.Active) {
      // console.log(new Date(details.NextDueDate));
      SyncedCron.remove(details.EmployeeId + "_" + details.FormID);
      SyncedCron.add({
        name: details.EmployeeId + "_" + details.FormID,
        schedule: function(parser) {
          return parser.recur().on(new Date(details.NextDueDate)).fullDate();
        },
        job: function() {
          Meteor.call('sendEmail', details);
          FutureTasks.remove(details.EmployeeId + "_" + details.FormID);
          SyncedCron.remove(details.EmployeeId + "_" + details.FormID);
          Meteor.call('calculateNextDate', details, function(error, result) {
            if (result !== '') {
              details.NextDueDate = result;
              // console.log('New next due date for rescheduling: ', result);
              Meteor.call('addTask', details);
            }
            return details.EmployeeId + "_" + details.FormID;
          });
        }
      })
    } else {
      // If email scheduling is inactive, remove corresponding FutureTask and SyncedCron job
      FutureTasks.remove(details.EmployeeId + "_" + details.FormID);
      SyncedCron.remove(details.EmployeeId + "_" + details.FormID);
    } 
  },
  calculateNextDate: function(details) {
    let startDate;
    if (details.NextDueDate) startDate = new Date(details.NextDueDate);
    else {
      if (details.StartDate) startDate = new Date(details.StartDate);
      else startDate = new Date();
    }
    startDate = startDate.getTime();
    if (details.Frequency === "M") {
      let months = '0,1,2,3,4,5,6,7,8,9,10,11';
      const monthDate = details.MonthDays;
      months = months.replace('january', 0).replace('february', 1).replace('march', 2)
        .replace('april', 3).replace('may', 4).replace('june', 5)
        .replace('july', 6).replace('august', 7).replace('september', 8)
        .replace('october', 9).replace('november', 10).replace('december', 11)
      months = months.split(',');
      let currentYear = moment().year();
      let suggestedNextDate = 0;
      let i = 0;
      while(moment().valueOf() > suggestedNextDate.valueOf()) {
          if (i === months.length) { currentYear++; i = 0; }
          suggestedNextDate = moment(startDate).year(currentYear).month(parseInt(months[i])).date(monthDate);
          i++;
      }

      // console.log('Monthly next date for email scheduling =============================>', suggestedNextDate.format('YYYY-MM-DD HH:mm'));
      return suggestedNextDate.format('YYYY-MM-DD HH:mm');
    } else if (details.Frequency === "W") {
      const selectedDay = details.WeekDay;
      const everyWeeks = details.Every === -1 ? 1 : details.Every;
      let suggestedNextDate = moment(startDate).day(selectedDay);
      while(moment().valueOf() > suggestedNextDate.valueOf()) {
        suggestedNextDate = moment(suggestedNextDate).add(everyWeeks, 'w');
      }

      // console.log('Weekly next date for email scheduling ===============================>', suggestedNextDate.format('YYYY-MM-DD HH:mm'));
      return suggestedNextDate.format('YYYY-MM-DD HH:mm');
    } else if (details.Frequency === "D") {
      const satAction = details.SatAction;
      const sunAction = details.SunAction;
      const everyDays = details.Every;
      let suggestedNextDate = moment(startDate);
      while(moment().valueOf() > suggestedNextDate.valueOf()) {
        if (satAction === 'P' && sunAction === 'P' && everyDays === -1) suggestedNextDate = moment(suggestedNextDate).add(1, 'd');
        else if (satAction === 'D' && sunAction === 'D') {
          if (moment(suggestedNextDate).add(1, 'd').day() === 6) suggestedNextDate = moment(suggestedNextDate).add(3, 'd');
          else if (moment(suggestedNextDate).add(1, 'd').day() === 0) suggestedNextDate = moment(suggestedNextDate).add(2, 'd');
          else suggestedNextDate = moment(suggestedNextDate).add(1, 'd');
        } else if (satAction === 'P' && sunAction === 'P' && everyDays !== -1) suggestedNextDate = moment(suggestedNextDate).add(everyDays, 'd');
      }

      // console.log('Daily next date for email scheduling ================================>', suggestedNextDate.format('YYYY-MM-DD HH:mm'));
      return suggestedNextDate.format('YYYY-MM-DD HH:mm');
    } else if (details.Frequency === "" && details.StartDate === details.EndDate) {
      const suggestedNextDate = moment(startDate);
      // console.log('One Time Only next date for email scheduling ===============================>', suggestedNextDate.format('YYYY-MM-DD HH:mm'));
      if (moment().valueOf() > suggestedNextDate.valueOf()) return '';
      else return suggestedNextDate.format('YYYY-MM-DD HH:mm');
    } else if (!details.Frequency) {
      return '';
    }
  },
  groupedReports: function(id, ids, url) {
    const formsData = [
      {
          id: 6,
          name: "Aged Payables",
          url: 'agedpayables'
      },
      {
          id: 134,
          name: "Aged Receivables",
          url: 'agedreceivables'
      },
      {
          id: 12,
          name: "Bills",
          url: 'allreports'
      },
      {
          id: 21,
          name: "Credits",
          url: 'allreports'
      },
      {
          id: 225,
          name: "General Ledger",
          url: 'generalledger'
      },
      {
          id: 18,
          name: "Cheque",
          url: 'chequelist'
      },
      {
          id: 1,
          name: "Grouped Reports",
          url: 'allreports'
      },
      {
          id: 61,
          name: "Customer Payments",
          url: 'allreports'
      },
      {
          id: 54,
          name: "Invoices",
          url: 'allreports'
      },
      {
          id: 177,
          name: "Print Statements",
          url: 'statementlist'
      },
      {
          id: 1464,
          name: "Product Sales Report",
          url: 'productsalesreport'
      },
      {
          id: 129,
          name: "Profit and Loss",
          url: 'newprofitandloss'
      },
      {
          id: 69,
          name: "Purchase Orders",
          url: 'allreports'
      },
      {
          id: 70,
          name: "Purchase Report",
          url: 'purchasesreport'
      },
      {
          id: 1364,
          name: "Purchase Summary Report",
          url: 'purchasesummaryreport'
      },
      {
          id: 71,
          name: "Quotes",
          url: 'allreports'
      },
      {
          id: 74,
          name: "Refunds",
          url: 'allreports'
      },
      {
          id: 77,
          name: "Sakes Orders",
          url: 'allreports'
      },
      {
          id: 68,
          name: "Sales Report",
          url: 'allreports'
      },
      {
          id: 17544,
          name: "Statements",
          url: 'statementlist'
      },
      {
          id: 94,
          name: "Supplier Payments",
          url: 'allreports'
      },
      {
          id: 278,
          name: "Tax Summary Report",
          url: 'taxsummaryreport'
      },
      {
          id: 140,
          name: "Trial Balance",
          url: 'trialbalance'
      },
    ];

    // console.log(id);
    // console.log(ids);
    let returnedValue = [];
    if (id == '1') {
        for (let i = 0; i < ids.length; i++) {
            const formData = formsData.filter(form => form.id == ids[i]);
            formData[0].url = url + '?report=' + formData[0].url;
            returnedValue.push(formData[0]);
        }
    } else {
      const formData = formsData.filter(form => form.id == id);
      formData[0].url = url + '?report=' + formData[0].url;
      returnedValue = [formData[0]];
    }
    return returnedValue;
  }
});

Meteor.methods({
  'chargeCard2': function(stripeToken, amountCharged, currency) {
    var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');

    Stripe.charges.create({
      amount: amountCharged,// this is equivalent to $65
      currency: currency,
      source: stripeToken
    },function(err, charge) {

    });
  },
  'listchargeCard2': function() {
    var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');

    Stripe.charges.list({
        limit: 2
    },function(err, charge) {
      if(err){

      }else{

          let valueData = charge.data;

          for (let j in valueData) {
            let billing_details = valueData[j].billing_details;
            let payment_details = valueData[j].payment_method_details;

          }
      }

    });
  },
  'listcustomersStripe': function() {
    var Stripe = StripeAPI('sk_test_51H019EDvlF0UkKE2l7GVsQ58NhZPtpyE9HdNWtuVRGKvwAxJulgpqEdRLhf7itv8jilNMRmsIlMhp0FIrRC9ynkk00yipso3BO');

    return Stripe.customers.list({

    },function(err, charge) {
      if(err){

      }else{

          let valueData = charge.data;
          return valueData;

          for (let j in valueData) {

          }
      }

    });
  }
});
