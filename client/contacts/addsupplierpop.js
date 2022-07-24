import {ContactService} from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import {UtilityService} from "../utility-service";
import {CountryService} from '../js/country-service';
import {PaymentsService} from '../payments/payments-service';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.addsupplierpop.onCreated(function(){
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.countryData = new ReactiveVar();
    templateObject.supplierrecords = new ReactiveVar([]);
    templateObject.recentTrasactions = new ReactiveVar([]);

    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.preferedPaymentList = new ReactiveVar();
    templateObject.termsList = new ReactiveVar();
    templateObject.deliveryMethodList = new ReactiveVar();
    templateObject.taxCodeList = new ReactiveVar();
    templateObject.defaultpurchasetaxcode = new ReactiveVar();

    templateObject.defaultpurchaseterm = new ReactiveVar();

    templateObject.isSameAddress = new ReactiveVar();
    templateObject.isSameAddress.set(false);

    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.currentAttachLineID = new ReactiveVar();
});

Template.addsupplierpop.onRendered(function () {
    $('.fullScreenSpin').css('display','inline-block');

    let templateObject = Template.instance();
    let contactService = new ContactService();
    var countryService = new CountryService();
    let paymentService = new PaymentsService();
    const records = [];
    let countries = [];

    let preferedPayments = [];
    let terms = [];
    let deliveryMethods = [];
    let taxCodes = [];

    let currentId = FlowRouter.current().queryParams;
    let supplierID = '';

    let totAmount = 0;
    let totAmountOverDue = 0;

    const dataTableList = [];
    const tableHeaderList = [];

    let purchasetaxcode = '';
    templateObject.defaultpurchasetaxcode.set(loggedTaxCodeSalesInc);
    setTimeout(function () {
        Meteor.call('readPrefMethod',Session.get('mycloudLogonID'),'defaulttax', function(error, result){
            if(error){
                purchasetaxcode =  loggedTaxCodeSalesInc;
                templateObject.defaultpurchasetaxcode.set(loggedTaxCodeSalesInc);
            }else{
                if(result){
                    purchasetaxcode = result.customFields[0].taxvalue || loggedTaxCodePurchaseInc;
                    templateObject.defaultpurchasetaxcode.set(purchasetaxcode);
                }

            }
        });
    }, 500);



    $("#dtStartingDate,#dtDOB,#dtTermninationDate,#dtAsOf").datepicker({
        showOn: 'button',
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: '/img/imgCal2.png',
        dateFormat: 'dd/mm/yy',
        showOtherMonths: true,
        selectOtherMonths: true,
        changeMonth: true,
        changeYear: true,
        yearRange: "-90:+10",
    });

    setTimeout(function () {

        $("#dtAsOf").datepicker({
            showOn: 'button',
            buttonText: 'Show Date',
            buttonImageOnly: true,
            buttonImage: '/img/imgCal2.png',
            dateFormat: 'dd/mm/yy',
            showOtherMonths: true,
            selectOtherMonths: true,
            changeMonth: true,
            changeYear: true,
            yearRange: "-90:+10",
        });
    }, 100);


    function MakeNegative() {
        $('td').each(function(){
            if($(this).text().indexOf('-'+Currency) >= 0) $(this).addClass('text-danger')
        });
    };

    templateObject.getCountryData = function () {
        getVS1Data('TCountries').then(function (dataObject) {
            if(dataObject.length == 0){
                countryService.getCountry().then((data) => {
                    for (let i = 0; i < data.tcountries.length; i++) {
                        countries.push(data.tcountries[i].Country)
                    }
                    countries = _.sortBy(countries);
                    templateObject.countryData.set(countries);
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcountries;
                for (let i = 0; i < useData.length; i++) {
                    countries.push(useData[i].Country)
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);

            }
        }).catch(function (err) {
            countryService.getCountry().then((data) => {
                for (let i = 0; i < data.tcountries.length; i++) {
                    countries.push(data.tcountries[i].Country)
                }
                countries = _.sortBy(countries);
                templateObject.countryData.set(countries);
            });
        });


    };

    templateObject.getCountryData();

    templateObject.getPreferedPaymentList = function () {
        getVS1Data('TPaymentMethod').then(function (dataObject) {
            if(dataObject.length == 0){
                contactService.getPaymentMethodDataVS1().then((data) => {
                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                        preferedPayments.push(data.tpaymentmethodvs1[i].PaymentMethodName)
                    }
                    preferedPayments = _.sortBy(preferedPayments);

                    templateObject.preferedPaymentList.set(preferedPayments);
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tpaymentmethodvs1;
                for (let i = 0; i < useData.length; i++) {
                    preferedPayments.push(useData[i].fields.PaymentMethodName)
                }
                preferedPayments = _.sortBy(preferedPayments);
                templateObject.preferedPaymentList.set(preferedPayments);
            }
        }).catch(function (err) {
            contactService.getPaymentMethodDataVS1().then((data) => {
                for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                    preferedPayments.push(data.tpaymentmethodvs1[i].PaymentMethodName)
                }
                preferedPayments = _.sortBy(preferedPayments);

                templateObject.preferedPaymentList.set(preferedPayments);
            });
        });


    };
    templateObject.getTermsList = function () {
        getVS1Data('TTermsVS1').then(function (dataObject) {
            if(dataObject.length == 0){
                contactService.getTermDataVS1().then((data) => {
                    for (let i = 0; i < data.ttermsvs1.length; i++) {
                        terms.push(data.ttermsvs1[i].TermsName);
                        if(data.ttermsvs1[i].isPurchasedefault == true){
                            templateObject.defaultpurchaseterm.set(data.ttermsvs1[i].TermsName);
                        }
                    }
                    terms = _.sortBy(terms);
                    templateObject.termsList.set(terms);
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttermsvs1;
                for (let i = 0; i < useData.length; i++) {
                    terms.push(useData[i].TermsName);
                    if(useData[i].isPurchasedefault == true){
                        templateObject.defaultpurchaseterm.set(useData[i].TermsName);
                    }
                }
                terms = _.sortBy(terms);
                templateObject.termsList.set(terms);

            }
        }).catch(function (err) {
            contactService.getTermDataVS1().then((data) => {
                for (let i = 0; i < data.ttermsvs1.length; i++) {
                    terms.push(data.ttermsvs1[i].TermsName);
                    if(data.ttermsvs1[i].isPurchasedefault == true){
                        templateObject.defaultpurchaseterm.set(data.ttermsvs1[i].TermsName);
                    }
                }
                terms = _.sortBy(terms);
                templateObject.termsList.set(terms);
            });
        });


    };

    templateObject.getDeliveryMethodList = function () {
        getVS1Data('TShippingMethod').then(function (dataObject) {
            if(dataObject.length == 0){
                contactService.getShippingMethodData().then((data) => {
                    for (let i = 0; i < data.tshippingmethod.length; i++) {
                        deliveryMethods.push(data.tshippingmethod[i].ShippingMethod)
                    }
                    deliveryMethods = _.sortBy(deliveryMethods);
                    templateObject.deliveryMethodList.set(deliveryMethods);
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tshippingmethod;
                for (let i = 0; i < useData.length; i++) {
                    deliveryMethods.push(useData[i].ShippingMethod)
                }
                deliveryMethods = _.sortBy(deliveryMethods);
                templateObject.deliveryMethodList.set(deliveryMethods);

            }
        }).catch(function (err) {
            contactService.getShippingMethodData().then((data) => {
                for (let i = 0; i < data.tshippingmethod.length; i++) {
                    deliveryMethods.push(data.tshippingmethod[i].ShippingMethod)
                }
                deliveryMethods = _.sortBy(deliveryMethods);
                templateObject.deliveryMethodList.set(deliveryMethods);
            });
        });

    };

    templateObject.getTaxCodesList = function () {
        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if(dataObject.length == 0){
                contactService.getTaxCodesVS1().then((data) => {
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        taxCodes.push(data.ttaxcodevs1[i].CodeName)
                    }
                    taxCodes = _.sortBy(taxCodes);
                    templateObject.taxCodeList.set(taxCodes);
                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttaxcodevs1;
                for (let i = 0; i < useData.length; i++) {
                    taxCodes.push(useData[i].CodeName)
                }
                taxCodes = _.sortBy(taxCodes);
                templateObject.taxCodeList.set(taxCodes);

            }
        }).catch(function (err) {
            contactService.getTaxCodesVS1().then((data) => {
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    taxCodes.push(data.ttaxcodevs1[i].CodeName)
                }
                taxCodes = _.sortBy(taxCodes);
                templateObject.taxCodeList.set(taxCodes);
            });
        });

    };

    templateObject.getPreferedPaymentList();
    templateObject.getTermsList();
    templateObject.getDeliveryMethodList();
    templateObject.getTaxCodesList();


            let lineItemObj = {
                id : '',
                lid : 'Add Supplier',
                company : '',
                email : '',
                title : '',
                firstname : '',
                middlename : '',
                lastname : '',
                tfn: '',
                phone : '',
                mobile:  '',
                fax: '',
                shippingaddress : '',
                scity : '',
                sstate : '',
                spostalcode : '',
                scountry : LoggedCountry || '',
                billingaddress : '',
                bcity : '',
                bstate : '',
                bpostalcode : '',
                bcountry : LoggedCountry || '',
                custFld1 : '',
                custFld2 : ''
            }
            templateObject.isSameAddress.set(true);
            templateObject.records.set(lineItemObj);

            setTimeout(function () {
                $('#sltTermsSuppPOP').val(templateObject.defaultpurchaseterm.get()||'');

            }, 2000);
            $('.fullScreenSpin').css('display','none');
        //}
    //}

    templateObject.getSuppliersList = function () {
        getVS1Data('TSupplierVS1').then(function (dataObject) {
            if(dataObject.length == 0){
                contactService.getAllSupplierSideDataVS1().then(function (dataSupp) {
                    let lineItemsSupp = [];
                    let lineItemObjSupp = {};

                    for(let j=0; j<dataSupp.tsuppliervs1.length; j++){
                        let classname ='';
                        if(!isNaN(currentId.id)){
                            if(dataSupp.tsuppliervs1[j].Id == parseInt(currentId.id)){
                                classname = 'currentSelect';
                            }
                        }
                        var dataListSupp = {
                            id: dataSupp.tsuppliervs1[j].Id || '',
                            company: dataSupp.tsuppliervs1[j].ClientName || '',
                            classname:classname
                        };
                        //
                        lineItemsSupp.push(dataListSupp);
                    }

                    templateObject.supplierrecords.set(lineItemsSupp);

                    if(templateObject.supplierrecords.get()){

                        setTimeout(function () {
                            $('.counter').text(lineItemsSupp.length + ' items');
                        }, 100);
                    }

                }).catch(function (err) {

                });
            }else{
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tsuppliervs1;
                let lineItemsSupp = [];
                let lineItemObjSupp = {};

                for(let j=0; j<useData.length; j++){
                    let classname ='';
                    if(!isNaN(currentId.id)){
                        if(useData[j].fields.ID == parseInt(currentId.id)){
                            classname = 'currentSelect';
                        }
                    }
                    var dataListSupp = {
                        id: useData[j].fields.ID || '',
                        company: useData[j].fields.ClientName || '',
                        classname:classname
                    };
                    //
                    lineItemsSupp.push(dataListSupp);
                }

                templateObject.supplierrecords.set(lineItemsSupp);

                if(templateObject.supplierrecords.get()){

                    setTimeout(function () {
                        $('.counter').text(lineItemsSupp.length + ' items');
                    }, 100);
                }

            }
        }).catch(function (err) {
            contactService.getAllSupplierSideDataVS1().then(function (dataSupp) {
                let lineItemsSupp = [];
                let lineItemObjSupp = {};

                for(let j=0; j<dataSupp.tsuppliervs1.length; j++){
                    let classname ='';
                    if(!isNaN(currentId.id)){
                        if(dataSupp.tsuppliervs1[j].Id == parseInt(currentId.id)){
                            classname = 'currentSelect';
                        }
                    }
                    var dataListSupp = {
                        id: dataSupp.tsuppliervs1[j].Id || '',
                        company: dataSupp.tsuppliervs1[j].ClientName || '',
                        classname:classname
                    };
                    //
                    lineItemsSupp.push(dataListSupp);
                }

                templateObject.supplierrecords.set(lineItemsSupp);

                if(templateObject.supplierrecords.get()){

                    setTimeout(function () {
                        $('.counter').text(lineItemsSupp.length + ' items');
                    }, 100);
                }

            }).catch(function (err) {

            });
        });

    }
    // templateObject.getSuppliersList();


    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)");

        function mediaQuery(x) {
            if (x.matches) {

                $("#displayList").removeClass("col-2");
                $("#displayList").addClass("col-3");

                $("#displayInfo").removeClass("col-10");
                $("#displayInfo").addClass("col-9");
            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 500);

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 420px)");
        var btnView = document.getElementById("btnsViewHide");


        function mediaQuery(x) {
            if (x.matches) {

                $("#displayList").removeClass("col-3");
                $("#displayList").addClass("col-12");
                $("#supplierListCard").removeClass("cardB");
                $("#supplierListCard").addClass("cardB420");
                btnsViewHide.style.display = "none";

                $("#displayInfo").removeClass("col-10");
                $("#displayInfo").addClass("col-12");
            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 500);


});

Template.addsupplierpop.events({

    'click #supplierShipping-1': function (event) {
        if($(event.target).is(':checked')){
            $('.supplierShipping-2').css('display','none');

        }else{
            $('.supplierShipping-2').css('display','block');
        }
    },
    'click .btnBack':function(event){
        event.preventDefault();
        history.back(1);
    },
    'click #chkSameAsShipping':function(event){
        if($(event.target).is(':checked')){

            // let streetAddress = $('#edtSupplierShippingAddress').val();
            // let city = $('#edtSupplierShippingCity').val();
            // let state =  $('#edtSupplierShippingState').val();
            // let zipcode =  $('#edtSupplierShippingZIP').val();
            //
            // let country =  $('#sedtCountry').val();
            //  $('#edtSupplierBillingAddress').val(streetAddress);
            //  $('#edtSupplierBillingCity').val(city);
            //  $('#edtSupplierBillingState').val(state);
            //  $('#edtSupplierBillingZIP').val(zipcode);
            //  $('#bcountry').val(country);
        }else{
            // $('#edtSupplierBillingAddress').val('');
            // $('#edtSupplierBillingCity').val('');
            // $('#edtSupplierBillingState').val('');
            // $('#edtSupplierBillingZIP').val('');
            // $('#bcountry').val('');
        }
    },
    'click .btnSaveSuppPOP': async function (event) {
        let templateObject = Template.instance();
        let contactService = new ContactService();
        if ($('#edtSupplierCompany').val() === ''){
            swal('Supplier Name should not be blank!', '', 'warning');
            e.preventDefault();
            return false;
        }
        $('.fullScreenSpin').css('display','inline-block');
        let supplierPOPID = $('#edtSupplierPOPID').val();
        let company = $('#edtSupplierCompany').val()||'';
        let email = $('#edtSupplierCompanyEmail').val()||'';
        let title = $('#edtSupplierTitle').val()||'';
        let firstname = $('#edtSupplierFirstName').val()||'';
        let middlename = $('#edtSupplierMiddleName').val()||'';
        let lastname = $('#edtSupplierLastName').val()||'';
        let suffix = $('#suffix').val()||'';
        let phone = $('#edtSupplierPhone').val()||'';
        let mobile = $('#edtSupplierMobile').val()||'';
        let fax = $('#edtSupplierFax').val()||'';
        let accountno = $('#edtSupplierAccountNo').val()||'';
        let skype = $('#edtSupplierSkypeID').val()||'';
        let website = $('#edtSupplierWebsite').val()||'';



        let streetAddress = $('#edtSupplierShippingAddress').val()||'';
        let city = $('#edtSupplierShippingCity').val()||'';
        let state =  $('#edtSupplierShippingState').val()||'';
        let postalcode =  $('#edtSupplierShippingZIP').val()||'';
        let country =  $('#sedtCountry').val()||'';

        let bstreetAddress = '';
        let bcity = '';
        let bstate = '';
        let bpostalcode = '';
        let bcountry = '';
        let isContractor = false;
        let isCustomer = false;
        if ($('#chkSameAsCustomer').is(':checked')) {
            isCustomer = true;
        }else{
            isCustomer = false;
        }
        if($('#isformcontractor').is(':checked')){
            isContractor = true;
        }
        if($('#chkSameAsShipping').is(':checked')){
            bstreetAddress = streetAddress;
            bcity = city;
            bstate = state;
            bpostalcode = postalcode;
            bcountry = country;
        }else{
            bstreetAddress = $('#edtSupplierBillingAddress').val()||'';
            bcity = $('#edtSupplierBillingCity').val()||'';
            bstate =  $('#edtSupplierBillingState').val()||'';
            bpostalcode =  $('#edtSupplierBillingZIP').val()||'';
            bcountry =  $('#bcountry').val()||'';
        }
        let sltPaymentMethodName =  $('#sltPreferedPayment').val()||'';
        let sltTermsName =  $('#sltTermsSuppPOP').val()||'';
        let sltShippingMethodName =  '';
        let notes =  $('#txaNotes').val()||'';
        let suppaccountno =  $('#suppAccountNo').val()||'';

        let custField1 = $('#edtCustomeField1').val()||'';
        let custField2 = $('#edtCustomeField2').val()||'';
        let custField3 = $('#edtCustomeField3').val()||'';
        let custField4 = $('#edtCustomeField4').val()||'';

        var url = FlowRouter.current().path;
        var getemp_id = url.split('?id=');
        var currentEmployee = getemp_id[getemp_id.length-1];
        var objDetails = '';

        let uploadedItems = templateObject.uploadedFiles.get();


            let suppdupID = 0;
            if(supplierPOPID != ''){
              objDetails = {
                  type: "TSupplierEx",
                  fields: {
                      ID: parseInt(supplierPOPID)||0,
                      Title:title,
                      ClientName:company,
                      FirstName: firstname,
                      CUSTFLD10:middlename,
                      LastName: lastname,
                      IsCustomer:isCustomer,
                      // TFN:suffix,
                      Email: email,
                      Phone: phone,
                      Mobile: mobile,
                      SkypeName: skype,
                      Faxnumber: fax,
                      // Sex: gender,
                      // Position: position,
                      Street: streetAddress,
                      Street2: city,
                      State: state,
                      PostCode:postalcode,
                      Country:country,
                      Contractor:isContractor,
                      BillStreet: bstreetAddress,
                      BillStreet2: bcity,
                      BillState: bstate,
                      BillPostCode:bpostalcode,
                      Billcountry:bcountry,
                      // CustFld1: custfield1,
                      // CustFld2: custfield2,
                      Notes:notes,
                      PaymentMethodName:sltPaymentMethodName,
                      TermsName:sltTermsName,
                      ShippingMethodName:sltShippingMethodName,
                      ClientNo:suppaccountno,
                      URL: website,
                      Attachments: uploadedItems,
                      CUSTFLD1: custField1,
                      CUSTFLD2: custField2,
                      CUSTFLD3: custField3,
                      CUSTFLD4: custField4,
                      PublishOnVS1: true

                  }
              };
            }else{
            let checkSuppData = await contactService.getCheckSuppliersData(company);
            if(checkSuppData.tsupplier.length){
                suppdupID = checkSuppData.tsupplier[0].Id;
                objDetails = {
                    type: "TSupplierEx",
                    fields: {
                        ID: suppdupID||0,
                        Title:title,
                        ClientName:company,
                        FirstName: firstname,
                        CUSTFLD10:middlename,
                        LastName: lastname,
                        IsCustomer:isCustomer,
                        // TFN:suffix,
                        Email: email,
                        Phone: phone,
                        Mobile: mobile,
                        SkypeName: skype,
                        Faxnumber: fax,
                        // Sex: gender,
                        // Position: position,
                        Street: streetAddress,
                        Street2: city,
                        State: state,
                        PostCode:postalcode,
                        Country:country,
                        Contractor:isContractor,
                        BillStreet: bstreetAddress,
                        BillStreet2: bcity,
                        BillState: bstate,
                        BillPostCode:bpostalcode,
                        Billcountry:bcountry,
                        // CustFld1: custfield1,
                        // CustFld2: custfield2,
                        Notes:notes,
                        PaymentMethodName:sltPaymentMethodName,
                        TermsName:sltTermsName,
                        ShippingMethodName:sltShippingMethodName,
                        ClientNo:suppaccountno,
                        URL: website,
                        Attachments: uploadedItems,
                        CUSTFLD1: custField1,
                        CUSTFLD2: custField2,
                        CUSTFLD3: custField3,
                        CUSTFLD4: custField4,
                        PublishOnVS1: true

                    }
                };
            }else{
                objDetails = {
                    type: "TSupplierEx",
                    fields: {
                        Title:title,
                        ClientName:company,
                        FirstName: firstname,
                        CUSTFLD10:middlename,
                        LastName: lastname,
                        IsCustomer:isCustomer,
                        // TFN:suffix,
                        Email: email,
                        Phone: phone,
                        Mobile: mobile,
                        SkypeName: skype,
                        Faxnumber: fax,
                        // Sex: gender,
                        // Position: position,
                        Street: streetAddress,
                        Street2: city,
                        State: state,
                        PostCode:postalcode,
                        Country:country,
                        Contractor:isContractor,
                        BillStreet: bstreetAddress,
                        BillStreet2: bcity,
                        BillState: bstate,
                        BillPostCode:bpostalcode,
                        Billcountry:bcountry,
                        // CustFld1: custfield1,
                        // CustFld2: custfield2,
                        Notes:notes,
                        PaymentMethodName:sltPaymentMethodName,
                        TermsName:sltTermsName,
                        ShippingMethodName:sltShippingMethodName,
                        ClientNo:suppaccountno,
                        URL: website,
                        Attachments: uploadedItems,
                        CUSTFLD1: custField1,
                        CUSTFLD2: custField2,
                        CUSTFLD3: custField3,
                        CUSTFLD4: custField4,
                        PublishOnVS1: true

                    }
                };

            }

          }
      //  }

        contactService.saveSupplierEx(objDetails).then(function (objDetails) {
            let supplierSaveID = objDetails.fields.ID;
            $('.fullScreenSpin').css('display', 'none');
            if(supplierSaveID){
               var currentLoc = FlowRouter.current().route.path;
               if (currentLoc == "/purchaseordercard" || currentLoc == "/billcard" || currentLoc == "/creditcard") {
                   $('.purchasesmodule #edtSupplierName').val(company);
                   $('.purchasesmodule #edtSupplierEmail').val(email);
                   $('.purchasesmodule #edtSupplierEmail').attr('customerid', supplierSaveID);
                   // $('.purchasesmodule #edtCustomerEmail').attr('customerfirstname', firstname);
                   // $('.purchasesmodule #edtCustomerEmail').attr('customerlastname', lastname);
                   $('.purchasesmodule #edtSupplierName').attr("custid", supplierSaveID);
                   var postalAddress = company + '\n' + streetAddress + '\n' + city + ' ' + state + '\n' + country;
                   $('.purchasesmodule #txabillingAddress').val(postalAddress);
                   $('.purchasesmodule #pdfCustomerAddress').html(postalAddress);
                   $('.purchasesmodule .pdfCustomerAddress').text(postalAddress);
                   $('.purchasesmodule #txaShipingInfo').val(postalAddress);
                   $('.purchasesmodule #sltTermsSuppPOP').val(sltTermsName);
               }else if ( currentLoc == "/chequecard") {
                   $('.purchasesmodule #edtSupplierName').val(company);
                   $('.purchasesmodule #edtSupplierEmail').val(email);
                   $('.purchasesmodule #edtSupplierEmail').attr('customerid', supplierSaveID);
                   // $('.purchasesmodule #edtCustomerEmail').attr('customerfirstname', firstname);
                   // $('.purchasesmodule #edtCustomerEmail').attr('customerlastname', lastname);
                   $('.purchasesmodule #edtSupplierName').attr("custid", supplierSaveID);
                   var postalAddress = company + '\n' + streetAddress + '\n' + city + ' ' + state + '\n' + country;
                   $('.purchasesmodule #txabillingAddress').val(postalAddress);
                   $('.purchasesmodule #pdfCustomerAddress').html(postalAddress);
                   $('.purchasesmodule .pdfCustomerAddress').text(postalAddress);
                   $('.purchasesmodule #txaShipingInfo').val(postalAddress);
                   // $('.purchasesmodule #sltTerms').val(sltTermsName);
               }  else {
                   sideBarService.getAllSuppliersDataVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                       addVS1Data('TSupplierVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                           location.reload();
                       }).catch(function (err) {
                           location.reload();
                       });
                   }).catch(function (err) {
                       location.reload();
                   });
               }

               $('#addSupplierModal').modal('toggle');

                sideBarService.getAllSuppliersDataVS1(initialBaseDataLoad,0).then(function(dataReload) {
                    addVS1Data('TSupplierVS1',JSON.stringify(dataReload)).then(function (datareturn) {

                    }).catch(function (err) {

                    });
                }).catch(function(err) {

                });
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
                    // Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });
            $('.fullScreenSpin').css('display','none');
        });

    },

    'keyup .search': function (event) {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('");

        $.extend($.expr[':'], {'containsi': function(elem, i, match, array){
            return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
                              });

        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function(e){
            $(this).attr('visible','false');
        });

        $(".results tbody tr:containsi('" + searchSplit + "')").each(function(e){
            $(this).attr('visible','true');
        });

        var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' items');

        if(jobCount == '0') {$('.no-result').show();}
        else {$('.no-result').hide();
             }
        if(searchTerm === ""){
            $(".results tbody tr").each(function(e){
                $(this).attr('visible','true');
                $('.no-result').hide();
            });

            //setTimeout(function () {
            var rowCount = $('.results tbody tr').length;
            $('.counter').text(rowCount + ' items');
            //}, 500);
        }

    },
    'click .tblSupplierSideList tbody tr': function (event) {

        var suppLineID = $(event.target).attr('id');
        if(suppLineID){
            window.open('/supplierscard?id=' + suppLineID,'_self');
        }
    },
    'click .chkDatatable' : function(event){
        var columns = $('#tblTransactionlist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function(i,v) {
            let className = v.classList;
            let replaceClass = className[1];

            if(v.innerText == columnDataValue){
                if($(event.target).is(':checked')){
                    $("."+replaceClass+"").css('display','table-cell');
                    $("."+replaceClass+"").css('padding','.75rem');
                    $("."+replaceClass+"").css('vertical-align','top');
                }else{
                    $("."+replaceClass+"").css('display','none');
                }
            }
        });
    },
    'click .resetTable' : function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblTransactionlist'});
                if (checkPrefDetails) {
                    CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
                        if (err) {

                        }else{
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable' : function(event){
        let lineItems = [];
        //let datatable =$('#tblTransactionlist').DataTable();
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text()||'';
            var colWidth = $tblrow.find(".custom-range").val()||0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate")||'';
            var colHidden = false;
            if($tblrow.find(".custom-control-input").is(':checked')){
                colHidden = false;
            }else{
                colHidden = true;
            }
            let lineItemObj = {
                index: index,
                label: colTitle,
                hidden: colHidden,
                width: colWidth,
                thclass: colthClass
            }

            lineItems.push(lineItemObj);
        });
        //datatable.state.save();
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'tblTransactionlist'});
                if (checkPrefDetails) {
                    CloudPreference.update({_id: checkPrefDetails._id},{$set: { userid: clientID,username:clientUsername,useremail:clientEmail,
                                                                               PrefGroup:'salesform',PrefName:'tblTransactionlist',published:true,
                                                                               customFields:lineItems,
                                                                               updatedAt: new Date() }}, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                }else{
                    CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
                                            PrefGroup:'salesform',PrefName:'tblTransactionlist',published:true,
                                            customFields:lineItems,
                                            createdAt: new Date() }, function(err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');

                        }
                    });

                }
            }
        }
        $('#myModal2').modal('toggle');
        //Meteor._reload.reload();
    },
    'blur .divcolumn' : function(event){
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblTransactionlist').DataTable();
        var title = datable.column( columnDatanIndex ).header();
        $(title).html(columData);

    },
    'change .rngRange' : function(event){
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblTransactionlist th');
        $.each(datable, function(i,v) {

            if(v.innerText == columnDataValue){
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("."+replaceClass+"").css('width',range+'px');

            }
        });

    },
    'click .btnOpenSettings' : function(event){
        let templateObject = Template.instance();
        var columns = $('#tblTransactionlist th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function(i,v) {
            if(v.hidden == false){
                columVisible =  true;
            }
            if((v.className.includes("hiddenColumn"))){
                columVisible = false;
            }
            sWidth = v.style.width.replace('px', "");

            let datatablerecordObj = {
                sTitle: v.innerText || '',
                sWidth: sWidth || '',
                sIndex: v.cellIndex || '',
                sVisible: columVisible || false,
                sClass: v.className || ''
            };
            tableHeaderList.push(datatablerecordObj);
        });

        templateObject.tableheaderrecords.set(tableHeaderList);
    },
    'click #exportbtn': function () {
        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletocsv').click();
        $('.fullScreenSpin').css('display','none');

    },
    'click .printConfirm' : function(event){

        $('.fullScreenSpin').css('display','inline-block');
        jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletopdf').click();
        $('.fullScreenSpin').css('display','none');
    },
    'click .btnRefresh': function () {
        Meteor._reload.reload();
    },

    'click #formCheck-2': function () {
        if($(event.target).is(':checked')){
            $('#autoUpdate').css('display','none');
        }else{
            $('#autoUpdate').css('display','block');
        }
    },
    'click #formCheck-one': function (event) {
        if($(event.target).is(':checked')){
            $('.checkbox1div').css('display','block');

        }else{
            $('.checkbox1div').css('display','none');
        }
    },
    'click #formCheck-two': function (event) {
        if($(event.target).is(':checked')){
            $('.checkbox2div').css('display','block');

        }else{
            $('.checkbox2div').css('display','none');
        }
    },
    'click #formCheck-three': function (event) {
        if($(event.target).is(':checked')){
            $('.checkbox3div').css('display','block');

        }else{
            $('.checkbox3div').css('display','none');
        }
    },
    'click #formCheck-four': function (event) {
        if($(event.target).is(':checked')){
            $('.checkbox4div').css('display','block');

        }else{
            $('.checkbox4div').css('display','none');
        }
    },
    'blur .customField1Text': function (event) {
        var inputValue1 = $('.customField1Text').text();
        $('.lblCustomField1').text(inputValue1);
    },
    'blur .customField2Text': function (event) {
        var inputValue2 = $('.customField2Text').text();
        $('.lblCustomField2').text(inputValue2);
    },
    'blur .customField3Text': function (event) {
        var inputValue3 = $('.customField3Text').text();
        $('.lblCustomField3').text(inputValue3);
    },
    'blur .customField4Text': function (event) {
        var inputValue4 = $('.customField4Text').text();
        $('.lblCustomField4').text(inputValue4);
    },
    'click .btnSaveSettings': function(event){
        let templateObject = Template.instance();


        $('.lblCustomField1').html('');
        $('.lblCustomField2').html('');
        $('.lblCustomField3').html('');
        $('.lblCustomField4').html('');
        let getchkcustomField1 = true;
        let getchkcustomField2 =  true;
        let getchkcustomField3 =  true;
        let getchkcustomField4 =  true;
        let getcustomField1 = $('.customField1Text').html();
        let getcustomField2 = $('.customField2Text').html();
        let getcustomField3 = $('.customField3Text').html();
        let getcustomField4 = $('.customField4Text').html();
        if($('#formCheck-one').is(':checked')){
            getchkcustomField1 = false;
        }
        if($('#formCheck-two').is(':checked')){
            getchkcustomField2 = false;
        }
        if($('#formCheck-three').is(':checked')){
            getchkcustomField3 = false;
        }
        if($('#formCheck-four').is(':checked')){
            getchkcustomField4 = false;
        }

        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'supplierscard'});
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id},{ $set: {username:clientUsername,useremail:clientEmail,
                                                                                 PrefGroup:'contactform',PrefName:'supplierscard',published:true,
                                                                                 customFields:[{
                                                                                     index: '1',
                                                                                     label: getcustomField1,
                                                                                     hidden: getchkcustomField1
                                                                                 },{
                                                                                     index: '2',
                                                                                     label: getcustomField2,
                                                                                     hidden: getchkcustomField2
                                                                                 },{
                                                                                     index: '3',
                                                                                     label: getcustomField3,
                                                                                     hidden: getchkcustomField3
                                                                                 },{
                                                                                     index: '4',
                                                                                     label: getcustomField4,
                                                                                     hidden: getchkcustomField4
                                                                                 }
                                                                                              ],
                                                                                 updatedAt: new Date() }}, function(err, idTag) {
                        if (err) {
                            $('#customfieldModal').modal('toggle');
                        } else {
                            $('#customfieldModal').modal('toggle');

                        }
                    });
                }else{
                    CloudPreference.insert({ userid: clientID,username:clientUsername,useremail:clientEmail,
                                            PrefGroup:'contactform',PrefName:'supplierscard',published:true,
                                            customFields:[{
                                                index: '1',
                                                label: getcustomField1,
                                                hidden: getchkcustomField1
                                            },{
                                                index: '2',
                                                label: getcustomField2,
                                                hidden: getchkcustomField2
                                            },{
                                                index: '3',
                                                label: getcustomField3,
                                                hidden: getchkcustomField3
                                            },{
                                                index: '4',
                                                label: getcustomField4,
                                                hidden: getchkcustomField4
                                            }
                                                         ],
                                            createdAt: new Date() }, function(err, idTag) {
                        if (err) {
                            $('#customfieldModal').modal('toggle');
                        } else {
                            $('#customfieldModal').modal('toggle');

                        }
                    });
                }
            }
        }

    },
    'click .btnResetSettings': function(event){
        var getcurrentCloudDetails = CloudUser.findOne({_id:Session.get('mycloudLogonID'),clouddatabaseID:Session.get('mycloudLogonDBID')});
        if(getcurrentCloudDetails){
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({userid:clientID,PrefName:'supplierscard'});
                if (checkPrefDetails) {
                    CloudPreference.remove({_id:checkPrefDetails._id}, function(err, idTag) {
                        if (err) {

                        }else{
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .new_attachment_btn':function(event){
        $('#attachment-upload').trigger('click');

    },
    'change #attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUploadTabs(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .img_new_attachment_btn':function(event){
        $('#img-attachment-upload').trigger('click');

    },
    'change #img-attachment-upload': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFiles.get();

        let myFiles = $('#img-attachment-upload')[0].files;
        let uploadData = utilityService.attachmentUpload(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);
        templateObj.uploadedFiles.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCount.set(uploadData.totalAttachments);
    },
    'click .remove-attachment': function (event,ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if(tempObj.$("#confirm-action-"+attachmentID).length){
            tempObj.$("#confirm-action-"+attachmentID).remove();
        }else{
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID +'"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-'+ attachmentID +'">'
            + 'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-'+attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .file-name': function(event){
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();

        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:'+input+';base64,'+uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type =  uploadedFiles[attachmentID].fields.Description;
        if(type ==='application/pdf'){
            previewFile.class = 'pdf-class';
        }else if(type === 'application/msword' || type ==='application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            previewFile.class = 'docx-class';
        }
        else if(type === 'application/vnd.ms-excel' || type ==='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if(type === 'application/vnd.ms-powerpoint' || type ==='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
            previewFile.class = 'ppt-class';
        }
        else if(type === 'application/vnd.oasis.opendocument.formula' || type ==='text/csv' || type ==='text/plain' || type ==='text/rtf'){
            previewFile.class = 'txt-class';
        }
        else if(type === 'application/zip' || type ==='application/rar' || type ==='application/x-zip-compressed' || type ==='application/x-zip,application/x-7z-compressed'){
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }

        if(type.split('/')[0]==='image'){
            previewFile.image = true
        }else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .confirm-delete-attachment': function (event,ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let  uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID,1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount --;
        if(attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if(uploadedArray.length > 0){
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentTabs(uploadedArray);
        }else{
            $(".attchment-tooltip").show();
        }
    },
    'click .attachmentTab':function(){
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if(uploadedFileArray.length > 0){
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentTabs(uploadedFileArray);
        }else{
            $(".attchment-tooltip").show();
        }
    },
    'click .btnView': function (e) {
        var btnView = document.getElementById("btnView");
        var btnHide = document.getElementById("btnHide");

        var displayList = document.getElementById("displayList");
        var displayInfo = document.getElementById("displayInfo");
        if (displayList.style.display === "none") {
            displayList.style.display = "flex";
            $("#displayInfo").removeClass("col-12");
            $("#displayInfo").addClass("col-9");
            btnView.style.display = "none";
            btnHide.style.display = "flex";
        } else {
            displayList.style.display = "none";
            $("#displayInfo").removeClass("col-9");
            $("#displayInfo").addClass("col-12");
            btnView.style.display = "flex";
            btnHide.style.display = "none";
        }
    },
    'click .transTab' : function(event){
        let templateObject = Template.instance();
        let supplierName = $('#edtSupplierCompany').val();
        templateObject.getAllProductRecentTransactions(supplierName);
    },
    'click .btnDeleteSupplier': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');

        let templateObject = Template.instance();
        let contactService2 = new ContactService();

        let currentId = FlowRouter.current().queryParams;
        var objDetails = '';

        if (!isNaN(currentId.id)) {
            currentSupplier = parseInt(currentId.id);
            objDetails = {
                type: "TSupplierEx",
                fields: {
                    ID: currentSupplier,
                    Active: false
                }
            };

            contactService2.saveSupplierEx(objDetails).then(function (objDetails) {
                FlowRouter.go('/supplierlist?success=true');
            }).catch(function (err) {
                swal({
                    title: 'Oooops...',
                    text: err,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'Try Again'
                }).then((result) => {
                    if (result.value) {
                    } else if (result.dismiss === 'cancel') {

                    }
                });
                $('.fullScreenSpin').css('display', 'none');
            });
        } else {
            FlowRouter.go('/supplierlist?success=true');
        }
        $('#deleteSupplierModal').modal('toggle');
    }

});

Template.addsupplierpop.helpers({
    record : () => {
        return Template.instance().records.get();
    },
    countryList: () => {
        return Template.instance().countryData.get();
    },
    supplierrecords: () => {
        return Template.instance().supplierrecords.get().sort(function(a, b){
            if (a.company == 'NA') {
                return 1;
            }
            else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords : () => {
        return Template.instance().datatablerecords.get().sort(function(a, b){
            if (a.orderdate == 'NA') {
                return 1;
            }
            else if (b.orderdate == 'NA') {
                return -1;
            }
            return (a.orderdate.toUpperCase() > b.orderdate.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'tblSalesOverview'});
    },
    currentdate : () => {
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },
    preferedPaymentList: () => {
        return Template.instance().preferedPaymentList.get();
    },
    termsList: () => {
        return Template.instance().termsList.get();
    },
    deliveryMethodList: () => {
        return Template.instance().deliveryMethodList.get();
    },
    taxCodeList: () => {
        return Template.instance().taxCodeList.get();
    },
    uploadedFiles: () => {
        return Template.instance().uploadedFiles.get();
    },
    attachmentCount: () => {
        return Template.instance().attachmentCount.get();
    },
    uploadedFile: () => {
        return Template.instance().uploadedFile.get();
    },
    contactCloudPreferenceRec: () => {
        return CloudPreference.findOne({userid:Session.get('mycloudLogonID'),PrefName:'supplierscard'});
    },
    isSameAddress: () => {
        return Template.instance().isSameAddress.get();
    },
    isMobileDevices: () =>{
        var isMobile = false; //initiate as false
        // device detection
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
           || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
            isMobile = true;
        }

        return isMobile;
    }
});
