



Template.nav.events({
'click #navhome' : function(event){
window.open('/home','_self');
},
'click #navbankaccounts' : function(event){
window.open('/bankaccounts','_self');
},
'click #navsales' : function(event){
window.open('/allsales','_self');
},
'click #navpurchases' : function(event){
window.open('/purchases','_self');
},
'click #navinventory' : function(event){
window.open('/productexpresslist','_self');
},
'click #navstockadjlist' : function(event){
window.open('/stockadjlist/#All','_self');
},
'click #navshipping' : function(event){
window.open('/shipping','_self');
},
'click #navexpenseclaims' : function(event){
window.open('/expenseclaims/current-claims','_self');
},
'click #navfixedassets' : function(event){
window.open('/fixedassets/draft','_self');
},
'click #navallreports' : function(event){
window.open('/allreports','_self');
},
'click #navvatreturns' : function(event){
window.open('/vatreturn','_self');
},
'click #navallcontacts' : function(event){
window.open('/allcontacts','_self');
},
'click #navcustomers' : function(event){
window.open('/customerlist','_self');
},
'click #navsuppliers' : function(event){
window.open('/supplierslist','_self');
},
'click #navtraining' : function(event){
window.open('/traininglist','_self');
},
'click #navgeneralsettings' : function(event){
window.open('/settings','_self');
},
'click #sidenavtimeclock' : function(event){
window.open('/employeetimeclock','_self');
}
});

Template.nav.onCreated(function(){



$(document).ready(function(){
var loc = FlowRouter.current().path;
if ( loc == "/home" ){
$('#navhome').addClass('nav_activestate');
$('#navaccounts').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/bankaccounts"){
$('#navaccounts').addClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/allsales"){
$('#navaccounts').addClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/purchases"){
$('#navaccounts').addClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/productexpresslist"){
$('#navaccounts').addClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/stockadjlist"){
$('#navaccounts').addClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/shipping"){
$('#navaccounts').addClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/expenseclaims/current-claims"){
$('#navaccounts').addClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/fixedassets/draft"){
$('#navaccounts').addClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/allreports"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/budgetmanager"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/agedpayables"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/agedreceivables"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/balancesheet"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/cashsummary"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/profitloss"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/trialbalance"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/vatreturn"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').addClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/allcontacts"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').addClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/customerlist"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').addClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/supplierslist"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').addClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/traininglist"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').addClass('nav_activestate');
$('#navsettings').removeClass('nav_activestate');
}else if(loc == "/settings"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').addClass('nav_activestate');
}else if(loc == "/settings/accounts"){
$('#navaccounts').removeClass('nav_activestate');
$('#navhome').removeClass('nav_activestate');
$('#navreports').removeClass('nav_activestate');
$('#navcontacts').removeClass('nav_activestate');
$('#navsettings').addClass('nav_activestate');
}

});



});

Template.nav.onRendered(function(){


var erpGet = erpDb();

var LoggedDB = erpGet.ERPDatabase;
document.getElementById("erpconnected").innerHTML = LoggedDB;
document.getElementById("loggeddatabase").innerHTML = LoggedDB;

var LoggedUser = localStorage.getItem('mySession');
document.getElementById("logged_user").innerHTML = LoggedUser;
document.getElementById("logged_dropdown").innerHTML = LoggedUser;
/*document.getElementById("loggeddatabaseuser").innerHTML = LoggedUser;*/
});
