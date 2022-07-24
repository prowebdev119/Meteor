import {SalesBoardService} from "../../js/sales-service";
import { ReactiveVar } from 'meteor/reactive-var';
import {EmployeeProfileService} from "../../js/profile-service";
import {AccountService} from "../../accounts/account-service";
const _ = require('lodash');
var custName;
let accountService = new AccountService();

Template.viewStatement.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar([]);
    templateObject.customerName = new ReactiveVar();
    templateObject.totalAmount = new ReactiveVar();
    templateObject.asAtDate = new ReactiveVar();
    templateObject.toDate = new ReactiveVar();
    templateObject.fromDate = new ReactiveVar();
    templateObject.errorMessage = new ReactiveVar();
    templateObject.errorMessage.set(false);
    templateObject.customerList = new ReactiveVar([]);
    templateObject.customerId = new ReactiveVar();
    templateObject.showPlaceholderInfo = new ReactiveVar();
    templateObject.showPlaceholderInfo.set(false);
    templateObject.streetAddress = new ReactiveVar();
    templateObject.city = new ReactiveVar();
    templateObject.postalCode = new ReactiveVar();
    templateObject.attention = new ReactiveVar();
    templateObject.mailCopyToUsr = new ReactiveVar();
    templateObject.isShowMailSentNotification = new ReactiveVar();
    templateObject.currentCustomerData = new ReactiveVar([]);
    templateObject.isPdfSelected = new ReactiveVar();

});

Template.viewStatement.onRendered(function () {
    var salesBoardService = new SalesBoardService();
    const templateObject = Template.instance();
    let date= new Date();
    const customerList = [];
    var table;
    let asAtDate, toDate,fromDate;
    custName= FlowRouter.current().queryParams.customerName;
    templateObject.customerName.set(custName);
    $("#period-input,#from-input,#to-input").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/dropdown_icon.png',
        dateFormat: 'dd M yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
yearRange: "-90:+10",
    });
    templateObject.$('#brandingPdf').val('Standard');
    templateObject.getAllCustomersList = function () {
        accountService.getCustomers().then(function (data) {
            let dataLength = data.tcustomer.length;
            for (let i = 0; i < dataLength; i++) {
                let customerName = (data.tcustomer[i].ClientName.replace(/","/g, " "));
                customerName = customerName.replace(/"/g, "");
                let customerObj = {
                    customerName: customerName,
                    email: data.tcustomer[i].Email,
                    ID: data.tcustomer[i].Id,
                    BankAccountBSB:data.tcustomer[i].BankAccountBSB,
                    BankAccountNo:data.tcustomer[i].BankAccountNo
                };
                customerList.push(customerObj);
                if (i === (dataLength - 1)) {
                    templateObject.customerList.set(customerList);
                }
            }
        }).catch(function (err) {
          swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
           Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
          });
        });
    };
    templateObject.getAllCustomersList();

    //as At Date input
    if(FlowRouter.current().queryParams.dateAsAt)
        templateObject.$('#period-input').val(moment(FlowRouter.current().queryParams.dateAsAt).format('DD MMM YYYY'));
    else
        templateObject.$('#period-input').val(moment(date).format('DD MMM YYYY'));

    asAtDate=templateObject.$('#period-input').val();
    templateObject.asAtDate.set(asAtDate);

    //between date input
    if(FlowRouter.current().queryParams.dateFrom)
        templateObject.$('#from-input').val(moment(FlowRouter.current().queryParams.dateFrom).format('DD MMM YYYY'));

    else
        templateObject.$('#from-input').val(moment(date).clone().startOf('month').format('DD MMM YYYY'));

    fromDate=templateObject.$('#from-input').val();
    templateObject.fromDate.set(fromDate);


    if(FlowRouter.current().queryParams.dateTo)
        templateObject.$('#to-input').val(moment(FlowRouter.current().queryParams.dateTo).format('DD MMM YYYY'));
    else
        templateObject.$('#to-input').val(moment(date).format('DD MMM YYYY'));

    toDate=templateObject.$('#to-input').val();
    templateObject.toDate.set(toDate);

    if(FlowRouter.current().queryParams.type=='Activity'){
        templateObject.$('#select-input').val('Activity');
        templateObject.$('.outstanding-div').css('display','none');
        templateObject.$('.outstanding-date').css('display','none');
        templateObject.$('.activity-div').css('display','block');
        templateObject.$('.activity-date').css('display','block');
    }else{
        templateObject.$('#select-input').val('Outstanding');
        templateObject.$('.outstanding-div').css('display','block');
        templateObject.$('.outstanding-date').css('display','block');
        templateObject.$('.activity-div').css('display','none');
        templateObject.$('.activity-date').css('display','none');
    }


    //get data function
    templateObject.fetchData = function(){
        let type=$('#select-input').val();
        let flag;
        if(type=='Activity'){

            flag=true;
            templateObject.$('.outstanding-date').css('display','none');
            templateObject.$('.activity-date').css('display','block');
        }else{
            flag=false;
            templateObject.$('.outstanding-date').css('display','block');
            templateObject.$('.activity-date').css('display','none');
        }

        salesBoardService.getTCustomerPaymentData(custName).then(function (data) {
            let record =[];
            let total=0;
            for(let i=0;i<data.tcustomerpayment.length;i++){
                 if(data.tcustomerpayment[i].fields.Lines && data.tcustomerpayment[i].fields.Lines.length){
                        for(let j=0;j< data.tcustomerpayment[i].fields.Lines.length;j++){
                            let recordObj={};
                            if(flag){
                                if(new Date($('#from-input').val()) <= new Date(data.tcustomerpayment[i].fields.Lines[j].fields.Date) &&
                                    new Date($('#to-input').val()) >= new Date(data.tcustomerpayment[i].fields.Lines[j].fields.Date)){
                                    recordObj.prepaymentId= parseInt(data.tcustomerpayment[i].fields.Lines[j].fields.PrepaymentId);
                                    recordObj.invoiceId= parseInt(data.tcustomerpayment[i].fields.Lines[j].fields.InvoiceId);
                                    recordObj.date=  moment(data.tcustomerpayment[i].fields.Lines[j].fields.Date).format('DD MMM YYYY')||'-';
                                    recordObj.activity= data.tcustomerpayment[i].fields.Lines[j].fields.InvoiceNo || '-';
                                    recordObj.reference=  data.tcustomerpayment[i].fields.Lines[j].fields.RefNo || '-';
                                    recordObj.dueDate=  moment(data.tcustomerpayment[i].fields.Lines[j].fields.EnteredAt).format('DD MMM YYYY') || '-';
                                    recordObj.invoiceAmount=  Currency+ data.tcustomerpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-';
                                    recordObj.payment=  Currency+ data.tcustomerpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-';
                                    recordObj.balance= Currency+ data.tcustomerpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2});
                                    total= total+ data.tcustomerpayment[i].fields.Lines[j].fields.AmountOutstanding;
                                }

                            }
                            else{
                                if(new Date($('#period-input').val()) >= new Date(data.tcustomerpayment[i].fields.Lines[j].fields.Date)){
                                    recordObj.prepaymentId= parseInt(data.tcustomerpayment[i].fields.Lines[j].fields.PrepaymentId);
                                    recordObj.invoiceId= parseInt(data.tcustomerpayment[i].fields.Lines[j].fields.InvoiceId);
                                    recordObj.date=  moment(data.tcustomerpayment[i].fields.Lines[j].fields.Date).format('DD MMM YYYY') || '-';
                                    recordObj.activity= data.tcustomerpayment[i].fields.Lines[j].fields.InvoiceNo || '-';
                                    recordObj.reference=  data.tcustomerpayment[i].fields.Lines[j].fields.RefNo || '-';
                                    recordObj.dueDate=  moment(data.tcustomerpayment[i].fields.Lines[j].fields.EnteredAt).format('DD MMM YYYY') || '-';
                                    recordObj.invoiceAmount=  Currency+ data.tcustomerpayment[i].fields.Lines[j].fields.OriginalAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-';
                                    recordObj.payment=  Currency+ data.tcustomerpayment[i].fields.Lines[j].fields.Payment.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-';
                                    recordObj.balance= Currency+ data.tcustomerpayment[i].fields.Lines[j].fields.AmountOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2}) || '-';
                                    total= total+ data.tcustomerpayment[i].fields.Lines[j].fields.AmountOutstanding;
                                }

                            }
                            if(Object.keys(recordObj).length)
                                record.push(recordObj)
                        }
                    }

            }
            templateObject.totalAmount.set(Currency+ total.toLocaleString(undefined, {minimumFractionDigits: 2}));
            templateObject.records.set(record);
            if ($.fn.DataTable.isDataTable('#viewStandardTable')) {
                $('#viewStandardTable').dataTable().fnDestroy();
                Meteor._reload.reload();
            }
            setTimeout(function () {
                table = $('#viewStandardTable').DataTable({
                    columnDefs: [
                        {orderable: false, targets: 0},
                    ],
                    select: true,
                    bSort: false,
                    bPaginate: false,
                    searching: false,
                    lengthChange: false,
                    info: false,
                    colReorder: false,
                    bStateSave: true,
                    action: function () {
                        table.ajax.reload();
                    },
                });

            }, 0);
            let url='/sales/view-statement?customerName='+templateObject.customerName.get()+'&type='+type+
                '&dateAsAt='+$('#period-input').val()+'&dateTo='+$('#to-input').val()+'&dateFrom='+$('#from-input').val();
            FlowRouter.go(url);

        })
    };
    templateObject.showAddress = function () {
        accountService.getTOneCustomerData(templateObject.customerName.get()).then(function (data) {
            if(data.tcustomer.length) {
               let customerData = data.tcustomer[0].fields;
                templateObject.currentCustomerData.set(customerData);
                templateObject.customerId.set(customerData.ID);
               if(customerData.ClientDetails) {
                   templateObject.streetAddress.set(customerData.ClientAddress);
                   templateObject.city.set(customerData.Suburb);
                   templateObject.postalCode.set(customerData.Postcode);
                   if(customerData.ExternalRef) {
                       templateObject.attention.set(customerData.ExternalRef);
                   }
               }
            }
        })
    };
    templateObject.showAddress();
    templateObject.generatePdfForMail = function() {
        return new Promise((resolve, reject) => {
            let templateObject = Template.instance();
            let data = templateObject.currentCustomerData.get();
            let completeTabRecord;
            let doc = new jsPDF();
            let imgPath='/img/logo_new.png';
            if(data){
                var invrecord = {
                    customername : data.ClientName,
                    shipto : data.StreetAddress,
                    abn: data.ABN,
                    department : data.ExternalRef,
                    saledate : moment(templateObject.asAtDate.get()).format('DD MMM YYYY'),
                    street1: data.Street,
                    street2: data.Street2,
                    street3: data.Country + ' ' + data.Postcode
                };
            }
            var invaddress =[
                templateObject.streetAddress.get(),
            ];
            doc.setFontSize(16);
            doc.text("Statement ", 20,40);
            doc.setFontSize(8);
            for(let i=0,j=5;i<invaddress.length;i++){
                if(invaddress[i]!=''){
                    doc.text(''+invaddress[i],35,53+j);
                    j=j+5;
                }
            }
            //purchase date
            doc.setFontType('bold');
            doc.text(''+invrecord.customername,35,53);
            //LOGO
            getDataUri= function (url, callback) {
                var image = new Image();
                image.onload = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size
                    canvas.getContext('2d').drawImage(this, 0, 0);
                    // ... or get as Data URI
                    callback(canvas.toDataURL('image/png'));
                };

                image.src = url;
            };
            templateObject.getPdfData = function () {
                doc.text("As At:", 110,40);
                //Delivery Date
                doc.text("ABN:",110,50);
                doc.setFontType('normal');
                doc.text(invrecord.saledate, 110,45);
                doc.text(invrecord.abn,110,65);
                doc.text(loggedCompany, 160,40);
                doc.text(invrecord.street1,160,45);
                doc.text(invrecord.street2,160,50);
                doc.text(invrecord.street3,160,55);
                //table
                doc.setFontType('bold');
                doc.text("Date",20,100);
                doc.text("Activity ",45,100);
                doc.text("Reference",65,100);
                doc.text("Due Date",90,100);
                doc.text("Invoice Amount",120,100);
                doc.text("Payments",155,100);
                doc.text("Balance AUD",175,100);
                doc.line(18,103,195,103);
                doc.setFontType('normal');
                doc.setFontSize(8);
                let axiz=110;
                let recordsData = templateObject.records.get();
                for(let i=0; i<recordsData.length; i++){
                    doc.text(''+recordsData[i].date || '',20,axiz);
                    doc.text(''+recordsData[i].activity || '',45,axiz);
                    doc.text(''+recordsData[i].reference || '',65,axiz);
                    doc.text(''+recordsData[i].dueDate || '',90,axiz);
                    doc.text(''+recordsData[i].invoiceAmount || 0,125,axiz);
                    doc.text(''+recordsData[i].payment || 0,160,axiz);
                    doc.text(''+recordsData[i].balance || 0,180,axiz);
                    axiz+=3;
                    doc.line(18,axiz,195,axiz);
                    axiz+=10;
                }
                doc.setFontType('bold');
                doc.setFontSize(10);
                doc.text('BALANCE DUE AUD',130,axiz);
                doc.text(''+templateObject.totalAmount.get(),180,axiz);
                axiz+=5;
                doc.line(105,axiz,195,axiz);
                axiz+=20;
                doc.setFontType('normal');
                doc.setFontSize(8);
                if((templateObject.$('#brandingPdf').val() === 'Special Projects' || (templateObject.$('#brandingPdf').val() === 'Standard')  && templateObject.isPdfSelected.get()) || ((templateObject.$('#brandingType').val() === 'Standard' || templateObject.$('#brandingType').val() === 'Special Projects')  && !templateObject.isPdfSelected.get())) {
                    doc.text("When paying by cheque, please complete this payment advice, detach and post to the address provided.\n\n" +
                        "Online payment preferred - use our account 012-234-12345678 or use the 'Pay online now' link to pay via" +
                        "PayPal with your credit card.",20,axiz);
                    if (recordsData.length > 5) {
                        doc.addPage();
                    }
                    axiz+=40;
                    doc.setFontSize(16);
                    doc.text("PAYMENT ADVICE",20,axiz);
                    doc.setFontSize(8);
                    doc.text("To:", 20,axiz+20);
                    doc.text(loggedCompany, 35,axiz+20);
                    doc.text(invrecord.street1,35,axiz+25);
                    doc.text(invrecord.street2,35,axiz+30);
                    doc.text(invrecord.street3,35,axiz+35);
                    axiz+=10;

                    //footer
                    doc.setFontType('bold');
                    doc.text("Customer",110,axiz);
                    doc.text("Overdue",110, axiz+4);
                    doc.line(110,axiz+8,195,axiz+8);
                    doc.text("Current",110, axiz+12);
                    doc.text("Total AUD Due",110, axiz+16);
                    doc.line(110,axiz+20,195,axiz+20);
                    doc.text("Amount Enclosed",110, axiz+24);
                    doc.setFontType('normal');
                    doc.text(invrecord.customername,150,axiz);
                    doc.text(templateObject.totalAmount.get(),150, axiz+4);
                    doc.text('0.00',150, axiz+12);
                    doc.text(templateObject.totalAmount.get(),150, axiz+16);
                    doc.line(150,axiz+26,195,axiz+26);
                    doc.setFontSize(6);
                    doc.text("Enter the amount you are paying above",158, axiz+30);
                } else {
                    doc.text("Online payment ONLY-BILLPAY direct to our account 083-234-12345678 please.",20,axiz);
                    axiz+=60;
                }
                if(templateObject.isPdfSelected.get()){
                    setTimeout(function () {
                        doc.save('Statement for '+templateObject.customerName.get()+'.pdf');
                    },1000);
                }
                else {
                    resolve(doc.output('datauri'));
                }

                setTimeout("$('#invoice').modal('hide');", 1000);
            };
            if((templateObject.$('#brandingPdf').val() === 'Very orange invoice!' && templateObject.isPdfSelected) || (templateObject.$('#brandingType').val() === 'Very orange invoice!' && !templateObject.isPdfSelected.get())) {
                imgPath = '/img/orange.png'
            }
                getDataUri(imgPath, function(dataUri) {

                    if((templateObject.$('#brandingPdf').val() === 'Very orange invoice!'  && templateObject.isPdfSelected.get()) || ((templateObject.$('#brandingType').val() === 'Very orange invoice!') && !templateObject.isPdfSelected.get()))
                    doc.addImage(dataUri , 'PNG', 20, 16, 21, 16);
                    else if ((templateObject.$('#brandingPdf').val() === 'Standard'  && templateObject.isPdfSelected.get()) || ((templateObject.$('#brandingType').val() === 'Standard') && !templateObject.isPdfSelected.get()))
                        doc.addImage(dataUri , 'PNG', 85, 18, 86, 18);
                    //logo end
                    templateObject.getPdfData();
                });
        });
    };

    $('.updateBtn').click();
});

Template.viewStatement.helpers({
    records: () => {
        return Template.instance().records.get();
    },
    customerName: () => {
        return Template.instance().customerName.get();
    },
    totalAmount: () => {
        return Template.instance().totalAmount.get();
    },
    asAtDate: () => {
        return Template.instance().asAtDate.get();
    },
    toDate: () => {
        return Template.instance().toDate.get();
    },
    fromDate: () => {
        return Template.instance().fromDate.get();
    },
    errorMessage: () => {
        return Template.instance().errorMessage.get();
    },
    customerId: () => {
        return Template.instance().customerId.get();
    },
    showPlaceholderInfo: () => {
        return Template.instance().showPlaceholderInfo.get();
    },
    streetAddress: () => {
        return Template.instance().streetAddress.get();
    },
    city: () => {
        return Template.instance().city.get();
    },
    postalCode: () => {
        return Template.instance().postalCode.get();
    },
    attention: () => {
        return Template.instance().attention.get();
    },
    mailCopyToUsr: () => {
        return Template.instance().mailCopyToUsr.get();
    },
    isShowMailSentNotification: () => {
        return Template.instance().isShowMailSentNotification.get();
    },
    currentCustomerData: () => {
        return Template.instance().currentCustomerData.get();
    }


});
Template.viewStatement.events({

    'change #locationField':function () {
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle(
                {center: geolocation, radius: position.coords.accuracy});
            autocomplete.setBounds(circle.getBounds());
        });
    }
    },

    'click #select-type-img':function () {
        let templateObject = Template.instance();
        templateObject.$(".select-account").trigger("focus");
    },
    'click .select-menu':function (e) {
        let templateObject = Template.instance();
        templateObject.$('#select-input').val(e.target.innerHTML);
        if(e.target.innerHTML =='Activity'){
            templateObject.$('.outstanding-div').css('display','none');
            templateObject.$('.activity-div').css('display','block');
        }else{
            templateObject.$('.outstanding-div').css('display','block');
            templateObject.$('.activity-div').css('display','none');
        }

    },
    'click .updateBtn':function (){
        let templateObject = Template.instance();
        if($('#select-input').val()=='Activity'){
            if(new Date($('#from-input').val())>= new Date($('#to-input').val()))
                templateObject.errorMessage.set(true);
            else
                templateObject.fetchData();
        }
        else
            templateObject.fetchData();
    },
    'click #viewStandardTable tbody tr':function (e){
       var invoiceNumber = e.currentTarget.id;
        let templateObject = Template.instance();
        if(invoiceNumber!='') {
            let records = templateObject.records.get();
            if(invoiceNumber.includes('ORC'))
                    invoiceNumber=parseInt(invoiceNumber.split('ORC')[1]);
                else
                    invoiceNumber = parseInt(invoiceNumber);
            for (let i = 0; i < records.length; i++) {
                if (records[i].activity == e.currentTarget.id) {
                    if(records[i].prepaymentId > 0 && records[i].invoiceId ==0 ){

                    }
                    else if(records[i].prepaymentId == 0 && records[i].invoiceId >0 )
                        window.open('/invoicepaidcard?id=' + invoiceNumber, '_self');
                    break;

                }
            }
        }


    },
    'click #save_address':function (){
        let templateObject = Template.instance();
        let objDetails = {
            type: "TCustomer",
            fields: {
                ID: templateObject.customerId.get(),
                Email: $('#emailAddress').val(),
                Country: $('#country').val(),
                State: $('#state').val(),
                Postcode: $('#postal').val(),
                ClientAddress: $('#streetAddress').val(),
                Suburb: $('#city').val(),
                ExternalRef: $('#attention').val()
            }
        };

        accountService.saveCustomerData(objDetails).then(function (data) {
            $('.close').click();
            Meteor._reload.reload();
        }).catch(function (err) {
          swal({
          title: 'Oooops...',
          text: err,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Try Again'
          }).then((result) => {
          if (result.value) {
           Meteor._reload.reload();
          } else if (result.dismiss === 'cancel') {

          }
          });
        });
    },
    'click #send-email-modal': function (e) {
        let templateObject = Template.instance();
     templateObject.isPdfSelected.set(false);
        var customerList= templateObject.customerList.get();
        var employeeProfileService = new EmployeeProfileService();
        employeeProfileService.getEmployeeProfile().then((dataListRet) => {
            for (var event in dataListRet) {
                var dataCopy = dataListRet[event];
                for (var data in dataCopy) {
                    var mainData = dataCopy[data];
                    var userEmail = mainData.Email;
                    let empName = localStorage.getItem('mySession');
                    if (userEmail != "") {
                        document.getElementById("loggedUserEmail").innerHTML = userEmail;
                        $('#loggedUserForCC').text(userEmail);
                        document.getElementById("loggedUserName").innerHTML = empName;
                        $('#mailTo').val($('#customerEmail').val());
                        let dateRange;
                        if($('#select-input').val()=='Activity')
                            dateRange=`for the period' ${templateObject.fromDate.get()} to ${templateObject.toDate.get()}`;
                        else
                            dateRange=`as at ${templateObject.asAtDate.get()}`;
                        let companyName = $('#erpconnected').text();
                        let mailSubject = `Statement from ${loggedCompany} for ${custName}`
                        let mailBody =
                            `Hi ${custName},\n\n Here's your statement ${dateRange}.\n\nIf you have any questions, please let us know.\n\nThanks,\n${loggedCompany}`;
                        $('#emailSubject').val(mailSubject);
                        $('#emailBody').html(mailBody);
                        for(let i=0; i<customerList.length;i++){
                            if (customerList[i].customerName == custName) {
                                $('#sendEmailTo').val(customerList[i].email);
                                break;
                            }
                        }
                        // $('.for-fonts li').click(function () {
                        //     if($(this).text() == 'Sales Invoice: Basic' ){
                        //         $('#emailBody').html(mailBody1);
                        //         $('#emailSubject').val(mailSubject1);
                        //     }else{
                        //         $('#emailBody').html(mailBody2);
                        //         $('#emailSubject').val(mailSubject2);
                        //     }
                        // });
                    } else {
                        Bert.alert('<strong>WARNING:</strong> Hey ! ' + empName + ' Please update your email id', 'warning');
                        FlowRouter.go('/settings/user');
                    }
                }
            }
        });
    },
    'click #send_email_btn': function (e) {
        let templateObject = Template.instance();
        let mailTo = $('#sendEmailTo').val().replace(/;/g, ",");
        var customerList= templateObject.customerList.get();
        if (mailTo === '') {
            swal('Customer has not been selected!', '', 'warning');
            e.preventDefault();
            return false;
        }

        function isEmailValid(mailTo) {
            return /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(mailTo);
        };

        if(!isEmailValid(mailTo)){
            Bert.alert('<strong>WARNING:</strong> The email field must be a valid email address !', 'warning');
            e.preventDefault();
            return false;
        }

        let mailSubject = $('#emailSubject').val();
        if (mailSubject === '') {
            Bert.alert('<strong>WARNING:</strong> The subject field must be completed!', 'warning');
            e.preventDefault();
            return false;
        }
        async function addAttachment() {
            let attachment = [];
            let templateObject = Template.instance();
                let encodedPdf = await templateObject.generatePdfForMail();
                encodedPdf = encodedPdf.split(',')[1];
                let pdfObject = {
                    filename: 'Statement for' + templateObject.customerName.get() + '.pdf',
                    content: encodedPdf,
                    encoding: 'base64'
                };
                attachment.push(pdfObject);

            let mailBody = $('#emailBody').html();
            let mailFrom = $('#loggedUserEmail').text();
            let mailCC = templateObject.mailCopyToUsr.get();
            Meteor.call('sendEmail', {
                from: mailFrom,
                to: mailTo,
                cc: mailCC,
                subject: mailSubject,
                text: mailBody,
                html:'',
                attachments : attachment
            }, function (error, result) {
                if (error && error.error === "error") {
                    Bert.alert('<strong>WARNING:</strong>' + error, 'warning');
                    event.preventDefault();
                } else {
                    let customerName=$.trim($('#sendEmailTo').val());
                    let emailToBeSaved = {
                        type: "TCustomer",
                        fields: {
                            Email:mailTo,
                            ClientName:customerName,
                            FirstName:customerName,
                            LastName:" ",
                        }
                    };
                    for(let i=0; i<customerList.length;i++) {
                        if (customerList[i].customerName == customerName) {
                            emailToBeSaved.fields.ID = customerList[i].ID;
                            if(customerList[i].BankAccountBSB !=''){
                                emailToBeSaved.fields.BankAccountNo=customerList[i].BankAccountNo||'1234567890';
                            }
                            break;
                        }

                    }
                     accountService.saveCustomerData(emailToBeSaved).then(function (data) {
                         templateObject.isShowMailSentNotification.set(true);
                     }).catch(function (err) {
                       swal({
                       title: 'Oooops...',
                       text: err,
                       type: 'error',
                       showCancelButton: false,
                       confirmButtonText: 'Try Again'
                       }).then((result) => {
                       if (result.value) {
                        Meteor._reload.reload();
                       } else if (result.dismiss === 'cancel') {

                       }
                       });
                     });

                    $('.close').click();

                }
            });
        }
        addAttachment();

    },
    'click #mailCopyToUsr': function (e) {
        let ccMailUsr = '';
        if($('#mailCopyToUsr').prop('checked')) {
            ccMailUsr  =  $('#loggedUserForCC').text();
        } else {
            ccMailUsr  =  '';
        }
        let templateObject = Template.instance();
        templateObject.mailCopyToUsr.set(ccMailUsr);
    },

    'click .editAddress':function () {
        let templateObject = Template.instance();
        accountService.getTOneCustomerData(templateObject.customerName.get()).then(function (data) {
            let customerData = data.tcustomer[0].fields;
            templateObject.customerId.set(customerData.ID);
            customerData.Email ?  templateObject.$('#emailAddress').val(customerData.Email) : templateObject.$('#emailAddress').val('');
            customerData.Country ?  templateObject.$('#country').val(customerData.Country) : templateObject.$('#country').val('');
            customerData.State ?  templateObject.$('#state').val(customerData.State) : templateObject.$('#state').val('');
            customerData.Postcode ?  templateObject.$('#postal').val(customerData.Postcode) : templateObject.$('#postal').val('');
            customerData.ClientAddress ?  templateObject.$('#streetAddress').val(customerData.ClientAddress) : templateObject.$('#streetAddress').val('');
            customerData.Suburb ?  templateObject.$('#city').val(customerData.Suburb) : templateObject.$('#city').val('');
            customerData.ExternalRef ?  templateObject.$('#attention').val(customerData.ExternalRef) : templateObject.$('#attention').val('');
        })
    },
    'click #show-info':function () {
        let templateObject = Template.instance();
        let showPlaceholder = !templateObject.showPlaceholderInfo.get();
        templateObject.showPlaceholderInfo.set(showPlaceholder);

    },
    'click #save_pdf': function () {
        let templateObject = Template.instance();
            templateObject.generatePdfForMail();
    },
    'click .pdf-option':function(event){
        $('#brandingPdf').val(event.currentTarget.innerText);
    },
    'click .branding-option':function(event){
        $('#brandingType').val(event.currentTarget.innerText);
    },
    'click #new_create_btn2':function(event){
        let templateObject = Template.instance();
        templateObject.isPdfSelected.set(true);
    },
    'click #customer-name':function(event){
        let templateObject = Template.instance();

        window.open('/customercard?id=' + templateObject.customerId.get(), '_self');
    }

});
