if (Meteor.isServer) {
   Meteor.startup( function() {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
      process.env.MAIL_URL =
         // "smtp://YOUR_DEFAULT_SMTP_LOGIN:YOUR_DEFAULT_PASSWORD@smtp.mailgun.org:587";
         "smtp://vsonecloud%40gmail.com:Jp9CvV2M5g@smtp.gmail.com:465/";
      WebApp.rawConnectHandlers.use(function(req, res, next) {
         res.setHeader("Access-Control-Allow-Origin", "*");
         res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
         return next();
      });
   });


//    Meteor.startup(function() {
//     var handler = StripeCheckout.configure({
// 		key: 'pk_test_51H019EDvlF0UkKE2KE9etEOQmp7Ujth0Zzuhxp8y7rrrj5NwowQDWqKZVCZTIlQGOWd3RH8ANsAaYqEg57ODSW6D00TNGazZJU',
// 		token: function(token) {}
// 	});
// });
}
