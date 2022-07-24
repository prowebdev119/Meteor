import { EmployeeProfileService } from "../../js/profile-service";

Template.trueERPSettings.onRendered(function() {
  let mailBody =
    "Since we both use VS1Cloud, you can send invoices directly to my Sales or Purchases \n\nThis makes processing invoices much faster and easier. \n\nTo do this, simply edit the contact details you have for me in VS1Cloud and enter the following key: \n\nMANS6MOSAUCJJ0DCTI8PTDIEYSGGV9 \n\nRegards \nDemo Company(AU) ";
  $("#mailBody").html(mailBody);
});

Template.trueERPSettings.events({
  "click #sendEmailbtn": function(event) {
    var emailIds = $("#emailIds")
      .val()
      .replace(/;/g, ",");
    var mailBody = $("#mailBody").html();

    if (emailIds === "") {
      Bert.alert(
        "<strong>WARNING:</strong> Email field cannot be empty!",
        "warning"
      );
      event.preventDefault();
    }
    if (mailBody === "") {
      Bert.alert(
        "<strong>WARNING:</strong> Message body cannot be empty!",
        "warning"
      );
      event.preventDefault();
    }

    var employeeProfileService = new EmployeeProfileService();
    employeeProfileService.getEmployeeProfile().then(dataListRet => {
      //var dataListRet = JSON.parse(oReq.responseText)
      for (var event in dataListRet) {
        var dataCopy = dataListRet[event];
        for (var data in dataCopy) {
          var mainData = dataCopy[data];
          var userEmail = mainData.Email;
          if (userEmail != "") {
            var mailFrom = userEmail;
          } else {
            var mailFrom = "trueerp-no_reply@sendmail.com";
          }
        }
      }
      Meteor.call(
        "sendEmail",
        {
          from: mailFrom,
          to: emailIds,
          cc: "",
          subject: "VS1Cloud Network key",
          text: mailBody,
          html: ""
        },
        function(error, result) {
          if (error && error.error === "error") {
            Bert.alert("<strong>WARNING:</strong>" + error, "warning");
            event.preventDefault();
            // show a nice error message
            // Session.set("errorMessage", "Please log in to delete a family.");

          } else {
            Bert.alert("<strong>Success:</strong> Mail Sent!", "success");
            $(".close").click();
          }
        }
      );
    });

    event.preventDefault();
  }
});
