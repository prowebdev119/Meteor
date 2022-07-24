import { ContactService } from "./contact-service";
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
import { UtilityService } from "../utility-service";
import { CountryService } from '../js/country-service';
import { PaymentsService } from '../payments/payments-service';
import { SideBarService } from '../js/sidebar-service';
import '../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let utilityService = new UtilityService();
Template.addcustomerpop.onCreated(function () {
    const templateObject = Template.instance();
    templateObject.records = new ReactiveVar();
    templateObject.countryData = new ReactiveVar();
    templateObject.customerrecords = new ReactiveVar([]);
    templateObject.recentTrasactions = new ReactiveVar([]);
    templateObject.datatablerecords = new ReactiveVar([]);
    templateObject.tableheaderrecords = new ReactiveVar([]);

    templateObject.datatablerecordsjob = new ReactiveVar([]);
    templateObject.tableheaderrecordsjob = new ReactiveVar([]);


    templateObject.preferedPaymentList = new ReactiveVar();
    templateObject.termsList = new ReactiveVar();
    templateObject.deliveryMethodList = new ReactiveVar();
    templateObject.clienttypeList = new ReactiveVar();
    templateObject.taxCodeList = new ReactiveVar();
    templateObject.defaultsaletaxcode = new ReactiveVar();

    templateObject.defaultsaleterm = new ReactiveVar();

    templateObject.isJob = new ReactiveVar();
    templateObject.isJob.set(false);

    templateObject.isSameAddress = new ReactiveVar();
    templateObject.isSameAddress.set(false);

    templateObject.isJobSameAddress = new ReactiveVar();
    templateObject.isJobSameAddress.set(false);

    /* Attachments */
    templateObject.uploadedFile = new ReactiveVar();
    templateObject.uploadedFiles = new ReactiveVar([]);
    templateObject.attachmentCount = new ReactiveVar();
    templateObject.currentAttachLineID = new ReactiveVar();

    templateObject.uploadedFileJob = new ReactiveVar();
    templateObject.uploadedFilesJob = new ReactiveVar([]);
    templateObject.attachmentCountJob = new ReactiveVar();

    templateObject.uploadedFileJobNoPOP = new ReactiveVar();
    templateObject.uploadedFilesJobNoPOP = new ReactiveVar([]);
    templateObject.attachmentCountJobNoPOP = new ReactiveVar();

    templateObject.currentAttachLineIDJob = new ReactiveVar();
});



Template.addcustomerpop.onRendered(function () {
    let templateObject = Template.instance();
    let contactService = new ContactService();
    var countryService = new CountryService();
    let paymentService = new PaymentsService();
    const records = [];
    let countries = [];

    let preferedPayments = [];
    let terms = [];
    let deliveryMethods = [];
    let clientType = [];
    let taxCodes = [];


    let currentId = FlowRouter.current().queryParams;
    let customerID = '';
    let totAmount = 0;
    let totAmountOverDue = 0;

    const dataTableList = [];
    const dataTableListJob = [];
    const tableHeaderList = [];

    const tableHeaderListJob = [];

    let salestaxcode = '';

    setTimeout(function () {
        Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'defaulttax', function (error, result) {
            if (error) {
                salestaxcode = loggedTaxCodeSalesInc;
                templateObject.defaultsaletaxcode.set(salestaxcode);
            } else {
                if (result) {
                    salestaxcode = result.customFields[1].taxvalue || loggedTaxCodeSalesInc;
                    templateObject.defaultsaletaxcode.set(salestaxcode);
                }

            }
        });
    }, 500);



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
    Meteor.call('readPrefMethod', Session.get('mycloudLogonID'), 'tblTransactionlist', function (error, result) {
        if (error) {

        } else {
            if (result) {

                for (let i = 0; i < result.customFields.length; i++) {
                    let customcolumn = result.customFields;
                    let columData = customcolumn[i].label;
                    let columHeaderUpdate = customcolumn[i].thclass.replace(/ /g, ".");
                    let hiddenColumn = customcolumn[i].hidden;
                    let columnClass = columHeaderUpdate.split('.')[1];
                    let columnWidth = customcolumn[i].width;
                    // let columnindex = customcolumn[i].index + 1;
                    $("th." + columnClass + "").html(columData);
                    $("th." + columnClass + "").css('width', "" + columnWidth + "px");

                }
            }

        }
    });

    function MakeNegative() {
        $('td').each(function () {
            if ($(this).text().indexOf('-' + Currency) >= 0) $(this).addClass('text-danger')
        });
    };


    templateObject.getCountryData = function () {
        getVS1Data('TCountries').then(function (dataObject) {
            if (dataObject.length == 0) {
                countryService.getCountry().then((data) => {
                    for (let i = 0; i < data.tcountries.length; i++) {
                        countries.push(data.tcountries[i].Country)
                    }
                    countries = _.sortBy(countries);
                    templateObject.countryData.set(countries);
                });
            } else {
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
            if (dataObject.length == 0) {
                contactService.getPaymentMethodDataVS1().then((data) => {
                    for (let i = 0; i < data.tpaymentmethodvs1.length; i++) {
                        preferedPayments.push(data.tpaymentmethodvs1[i].PaymentMethodName)
                    }
                    preferedPayments = _.sortBy(preferedPayments);

                    templateObject.preferedPaymentList.set(preferedPayments);
                });
            } else {
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
            if (dataObject.length == 0) {
                contactService.getTermDataVS1().then((data) => {
                    for (let i = 0; i < data.ttermsvs1.length; i++) {
                        terms.push(data.ttermsvs1[i].TermsName);
                        if(data.ttermsvs1[i].isSalesdefault == true){
                            templateObject.defaultsaleterm.set(data.ttermsvs1[i].TermsName);
                            // $('.termsSelect').val(data.ttermsvs1[i].TermsName);
                        }
                    }
                    terms = _.sortBy(terms);
                    templateObject.termsList.set(terms);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.ttermsvs1;
                for (let i = 0; i < useData.length; i++) {
                    terms.push(useData[i].TermsName);
                    if(useData[i].isSalesdefault == true){
                        templateObject.defaultsaleterm.set(useData[i].TermsName);
                        //$('.termsSelect').val(useData[i].TermsName);
                    }
                }
                terms = _.sortBy(terms);
                templateObject.termsList.set(terms);

            }
        }).catch(function (err) {
            contactService.getTermDataVS1().then((data) => {
                for (let i = 0; i < data.ttermsvs1.length; i++) {
                    terms.push(data.ttermsvs1[i].TermsName);
                    if(data.ttermsvs1[i].isSalesdefault == true){
                        templateObject.defaultsaleterm.set(data.ttermsvs1[i].TermsName);
                    }
                }
                terms = _.sortBy(terms);
                templateObject.termsList.set(terms);
            });
        });
    };

    templateObject.getDeliveryMethodList = function () {
        getVS1Data('TShippingMethod').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getShippingMethodData().then((data) => {
                    for (let i = 0; i < data.tshippingmethod.length; i++) {
                        deliveryMethods.push(data.tshippingmethod[i].ShippingMethod)
                    }
                    deliveryMethods = _.sortBy(deliveryMethods);
                    templateObject.deliveryMethodList.set(deliveryMethods);
                });
            } else {
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

    templateObject.getClientTypeData = function () {
        getVS1Data('TClientType').then(function (dataObject) {
            if (dataObject.length == 0) {
                sideBarService.getClientTypeData().then((data) => {
                    for (let i = 0; i < data.tclienttype.length; i++) {
                        clientType.push(data.tclienttype[i].fields.TypeName)
                    }
                    clientType = _.sortBy(clientType);
                    templateObject.clienttypeList.set(clientType);
                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tclienttype;
                for (let i = 0; i < useData.length; i++) {
                    clientType.push(useData[i].fields.TypeName)
                }
                clientType = _.sortBy(clientType);
                templateObject.clienttypeList.set(clientType);
                //$('.customerTypeSelect option:first').prop('selected', false);
                $(".customerTypeSelect").attr('selectedIndex', 0);

            }
        }).catch(function (err) {
            sideBarService.getClientTypeData().then((data) => {
                for (let i = 0; i < data.tclienttype.length; i++) {
                    clientType.push(data.tclienttype[i].fields.TypeName)
                }
                clientType = _.sortBy(clientType);
                templateObject.clienttypeList.set(clientType);
            });
        });

    };

    templateObject.getTaxCodesList = function () {
        getVS1Data('TTaxcodeVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getTaxCodesVS1().then((data) => {
                    for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                        taxCodes.push(data.ttaxcodevs1[i].CodeName)
                    }
                    taxCodes = _.sortBy(taxCodes);
                    templateObject.taxCodeList.set(taxCodes);
                });
            } else {
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
    templateObject.getClientTypeData();


    //$('#sltCustomerType').append('<option value="' + lineItemObj.custometype + '">' + lineItemObj.custometype + '</option>');
    //if (currentId.id == "undefined") {
        let lineItemObj = {
            id: '',
            lid: 'Add Customer',
            company: '',
            email: '',
            title: '',
            firstname: '',
            middlename: '',
            lastname: '',
            tfn: '',
            phone: '',
            mobile: '',
            fax: '',
            shippingaddress: '',
            scity: '',
            sstate: '',
            terms: templateObject.defaultsaleterm.get() || '',
            spostalcode: '',
            scountry: LoggedCountry || '',
            billingaddress: '',
            bcity: '',
            bstate: '',
            bpostalcode: '',
            bcountry: LoggedCountry || '',
            custFld1: '',
            custFld2: '',
            jobbcountry: LoggedCountry || '',
            jobscountry: LoggedCountry || '',
            discount:0
        }
        setTimeout(function () {
            $('.customerTypeSelect').append('<option value="newCust">Add Customer Type</option>');
        },500)
        templateObject.isSameAddress.set(true);
        templateObject.records.set(lineItemObj);
        setTimeout(function () {
            $('#tblTransactionlist').DataTable();
            if (currentId.transTab == 'active') {
                $('.customerTab').removeClass('active');
                $('.transactionTab').trigger('click');
            }else if (currentId.transTab == 'job') {
                $('.customerTab').removeClass('active');
                $('.jobTab').trigger('click');
            }else{
                $('.customerTab').addClass('active');
                $('.customerTab').trigger('click');
            }

        }, 500);



    templateObject.getCustomersList = function () {
        getVS1Data('TCustomerVS1').then(function (dataObject) {
            if (dataObject.length == 0) {
                contactService.getAllCustomerSideDataVS1().then(function (data) {
                    let lineItems = [];
                    let lineItemObj = {};
                    for (let i = 0; i < data.tcustomervs1.length; i++) {
                        let classname = '';
                        if (!isNaN(currentId.id)) {
                            if (data.tcustomervs1.Id == parseInt(currentId.id)) {
                                classname = 'currentSelect';
                            }
                        }
                        if (!isNaN(currentId.jobid)) {
                            if (data.tcustomervs1.Id == parseInt(currentId.jobid)) {
                                classname = 'currentSelect';
                            }
                        }
                        var dataList = {
                            id: data.tcustomervs1[i].Id || '',
                            company: data.tcustomervs1[i].ClientName || '',
                            isslectJob: data.tcustomervs1[i].IsJob || false,
                            classname: classname
                        };

                        lineItems.push(dataList);
                    }

                    templateObject.customerrecords.set(lineItems);

                    if (templateObject.customerrecords.get()) {

                        setTimeout(function () {
                            $('.counter').text(lineItems.length + ' items');
                        }, 100);
                    }

                }).catch(function (err) {
                    //Bert.alert('<strong>' + err + '</strong>!', 'danger');

                });
            } else {
                let data = JSON.parse(dataObject[0].data);
                let useData = data.tcustomervs1;
                let lineItems = [];
                let lineItemObj = {};

                for (let i = 0; i < useData.length; i++) {
                    let classname = '';
                    if (!isNaN(currentId.id)) {
                        if (useData[i].fields.ID == parseInt(currentId.id)) {
                            classname = 'currentSelect';
                        }
                    }

                    if (!isNaN(currentId.jobid)) {
                        if (useData[i].fields.ID == parseInt(currentId.jobid)) {
                            classname = 'currentSelect';
                        }
                    }
                    var dataList = {
                        id: useData[i].fields.ID || '',
                        company: useData[i].fields.ClientName || '',
                        isslectJob: useData[i].fields.IsJob || false,
                        classname: classname
                    };

                    lineItems.push(dataList);
                }

                templateObject.customerrecords.set(lineItems);

                if (templateObject.customerrecords.get()) {

                    setTimeout(function () {
                        $('.counter').text(lineItems.length + ' items');
                    }, 100);
                }

            }
        }).catch(function (err) {
            contactService.getAllCustomerSideDataVS1().then(function (data) {
                let lineItems = [];
                let lineItemObj = {};
                for (let i = 0; i < data.tcustomervs1.length; i++) {
                    let classname = '';
                    if (!isNaN(currentId.id)) {
                        if (data.tcustomervs1.Id == parseInt(currentId.id)) {
                            classname = 'currentSelect';
                        }
                    }
                    if (!isNaN(currentId.jobid)) {
                        if (data.tcustomervs1.Id == parseInt(currentId.jobid)) {
                            classname = 'currentSelect';
                        }
                    }
                    var dataList = {
                        id: data.tcustomervs1[i].Id || '',
                        company: data.tcustomervs1[i].ClientName || '',
                        isslectJob: data.tcustomervs1[i].IsJob || false,
                        classname: classname
                    };

                    lineItems.push(dataList);
                }

                templateObject.customerrecords.set(lineItems);

                if (templateObject.customerrecords.get()) {

                    setTimeout(function () {
                        $('.counter').text(lineItems.length + ' items');
                    }, 100);
                }

            }).catch(function (err) {
                //Bert.alert('<strong>' + err + '</strong>!', 'danger');

            });
        });

    }
    templateObject.getCustomersList();


    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)")

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
        // var btnView = document.getElementById("btnsViewHide");


        function mediaQuery(x) {
            if (x.matches) {

                $("#displayList").removeClass("col-3");
                $("#displayList").addClass("col-12");
                $("#customerListCard").removeClass("cardB");
                $("#customerListCard").addClass("cardB420");
                // btnsViewHide.style.display = "none";

                $("#displayInfo").removeClass("col-9");
                $("#displayInfo").addClass("col-12");
            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)

    }, 500);

    setTimeout

});
Template.addcustomerpop.events({
    'click .tblJoblist tbody tr': function (event) {

        var listData = $(event.target).closest('tr').attr('id');
        if (listData) {
            window.open('/customerscard?jobid=' + listData, '_self');
        }
    },
    'click #customerShipping-1': function (event) {
        if ($(event.target).is(':checked')) {
            $('.customerShipping-2').css('display', 'none');

        } else {
            $('.customerShipping-2').css('display', 'block');
        }
    },
    'click .btnBack': function (event) {
        // event.preventDefault();
        history.back(1);
        //FlowRouter.go('/customerlist');
    },
    'click .btnSaveDept': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        let contactService = new ContactService();

        //let headerDept = $('#sltDepartment').val();
        let custType = $('#edtDeptName').val();
        let typeDesc = $('#txaDescription').val() || '';
        if (custType === '') {
            swal('Client Type name cannot be blank!', '', 'warning');

            e.preventDefault();
        } else {
            let objDetails = {
                type: "TClientType",
                fields: {
                    TypeName: custType,
                    TypeDescription: typeDesc,
                }
            }
            contactService.saveClientTypeData(objDetails).then(function (objDetails) {
                sideBarService.getClientTypeData().then(function(dataReload) {
                    addVS1Data('TClientType', JSON.stringify(dataReload)).then(function (datareturn) {
                        Meteor._reload.reload();
                    }).catch(function (err) {
                        Meteor._reload.reload();
                    });
                }).catch(function (err) {
                    Meteor._reload.reload();
                });
                // Meteor._reload.reload();
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

            });
        }




        // if(deptID == ""){

        //     taxRateService.checkDepartmentByName(deptName).then(function (data) {
        //         deptID = data.tdeptclass[0].Id;
        //         objDetails = {
        //             type: "TDeptClass",
        //             fields: {
        //                 ID: deptID||0,
        //                 Active: true,
        //                 //DeptClassGroup: headerDept,
        //                 //DeptClassName: deptName,
        //                 Description: deptDesc,
        //                 SiteCode: siteCode,
        //                 StSClass: objStSDetails
        //             }
        //         };

        //         taxRateService.saveDepartment(objDetails).then(function (objDetails) {
        //             Meteor._reload.reload();
        //         }).catch(function (err) {
        //             swal({
        //                 title: 'Oooops...',
        //                 text: err,
        //                 type: 'error',
        //                 showCancelButton: false,
        //                 confirmButtonText: 'Try Again'
        //             }).then((result) => {
        //                 if (result.value) {
        //                     // Meteor._reload.reload();
        //                 } else if (result.dismiss === 'cancel') {

        //                 }
        //             });
        //
        //         });

        //     }).catch(function (err) {
        //         objDetails = {
        //             type: "TDeptClass",
        //             fields: {
        //                 Active: true,
        //                 DeptClassName: deptName,
        //                 Description: deptDesc,
        //                 SiteCode: siteCode,
        //                 StSClass: objStSDetails
        //             }
        //         };

        //         taxRateService.saveDepartment(objDetails).then(function (objDetails) {
        //             Meteor._reload.reload();
        //         }).catch(function (err) {
        //             swal({
        //                 title: 'Oooops...',
        //                 text: err,
        //                 type: 'error',
        //                 showCancelButton: false,
        //                 confirmButtonText: 'Try Again'
        //             }).then((result) => {
        //                 if (result.value) {
        //                     // Meteor._reload.reload();
        //                 } else if (result.dismiss === 'cancel') {

        //                 }
        //             });
        //
        //         });
        //     });

        // }else{
        //     objDetails = {
        //         type: "TDeptClass",
        //         fields: {
        //             ID: deptID,
        //             Active: true,
        //             //  DeptClassGroup: headerDept,
        //             DeptClassName: deptName,
        //             Description: deptDesc,
        //             SiteCode: siteCode,
        //             StSClass: objStSDetails
        //         }
        //     };

        //     taxRateService.saveDepartment(objDetails).then(function (objDetails) {
        //         Meteor._reload.reload();
        //     }).catch(function (err) {
        //         swal({
        //             title: 'Oooops...',
        //             text: err,
        //             type: 'error',
        //             showCancelButton: false,
        //             confirmButtonText: 'Try Again'
        //         }).then((result) => {
        //             if (result.value) {
        //                 // Meteor._reload.reload();
        //             } else if (result.dismiss === 'cancel') {

        //             }
        //         });
        //
        //     });
        // }




    },
    'click #chkSameAsShipping': function (event) {
        /*if($(event.target).is(':checked')){
      let streetAddress = $('#edtCustomerShippingAddress').val();
      let city = $('#edtCustomerShippingCity').val();
      let state =  $('#edtCustomerShippingState').val();
      let zipcode =  $('#edtCustomerShippingZIP').val();
      let country =  $('#sedtCountry').val();

       $('#edtCustomerBillingAddress').val(streetAddress);
       $('#edtCustomerBillingCity').val(city);
       $('#edtCustomerBillingState').val(state);
       $('#edtCustomerBillingZIP').val(zipcode);
       $('#bedtCountry').val(country);
    }else{
      $('#edtCustomerBillingAddress').val('');
      $('#edtCustomerBillingCity').val('');
      $('#edtCustomerBillingState').val('');
      $('#edtCustomerBillingZIP').val('');
      $('#bedtCountry').val('');
    }
    */
    },
    'click .btnSaveCustPOP': async function (event) {
        let templateObject = Template.instance();
        let contactService = new ContactService();
        $('.fullScreenSpin').css('display', 'inline-block');
        let customerPOPID = $('#edtCustomerPOPID').val();
        let company = $('#edtCustomerCompany').val();
        let email = $('#edtCustomerPOPEmail').val();
        let title = $('#edtTitle').val();
        let firstname = $('#edtFirstName').val();
        let middlename = $('#edtMiddleName').val();
        let lastname = $('#edtLastName').val();
        // let suffix = $('#edtSuffix').val();
        let phone = $('#edtCustomerPhone').val();
        let mobile = $('#edtCustomerMobile').val();
        let fax = $('#edtCustomerFax').val();
        let accountno = $('#edtClientNo').val();
        let skype = $('#edtCustomerSkypeID').val();
        let website = $('#edtCustomerWebsite').val();



        let streetAddress = $('#edtCustomerShippingAddress').val();
        let city = $('#edtCustomerShippingCity').val();
        let state = $('#edtCustomerShippingState').val();
        let postalcode = $('#edtCustomerShippingZIP').val();
        let country = $('#sedtCountry').val();
        let bstreetAddress = '';
        let bcity = '';
        let bstate = '';
        let bzipcode = '';
        let bcountry = '';
        let isSupplier = false;
        if ($('#chkSameAsSupplier').is(':checked')) {
            isSupplier = true;
        }else{
            isSupplier = false;
        }
        if ($('#chkSameAsShipping2').is(':checked')) {
            bstreetAddress = streetAddress;
            bcity = city;
            bstate = state;
            bzipcode = postalcode;
            bcountry = country;
        } else {
            bstreetAddress = $('#edtCustomerBillingAddress').val();
            bcity = $('#edtCustomerBillingCity').val();
            bstate = $('#edtCustomerBillingState').val();
            bzipcode = $('#edtCustomerBillingZIP').val();
            bcountry = $('#bedtCountry').val();
        }

        let sltPaymentMethodName = $('#sltPreferedPayment').val();
        let sltTermsName = $('#sltTermsPOP').val();
        let sltShippingMethodName = '';
        let rewardPointsOpeningBalance = $('#custOpeningBalance').val();
        // let sltRewardPointsOpeningDate =  $('#dtAsOf').val();

        var sltRewardPointsOpeningDate = new Date($("#dtAsOf").datepicker("getDate"));

        let openingDate = sltRewardPointsOpeningDate.getFullYear() + "-" + (sltRewardPointsOpeningDate.getMonth() + 1) + "-" + sltRewardPointsOpeningDate.getDate();

        let sltTaxCodeName = "";

        let isChecked = $(".chkTaxExempt").is(":checked");
        if (isChecked) {
            sltTaxCodeName = "NT";
        } else {
            sltTaxCodeName = $('#sltTaxCode').val();
        }

        let permanentDiscount = $('#edtCustomerCardDiscount').val()||0;
        let notes = $('#txaNotes').val();
        let custField1 = $('#edtCustomeField1').val();
        let custField2 = $('#edtCustomeField2').val();
        let custField3 = $('#edtCustomeField3').val();
        let custField4 = $('#edtCustomeField4').val();
        let customerType = $('#sltCustomerType').val()||'';
        let uploadedItems = templateObject.uploadedFiles.get();

        var url = FlowRouter.current().path;
        var getemp_id = url.split('?id=');
        var currentEmployee = getemp_id[getemp_id.length - 1];
        var objDetails = '';

            let custdupID = 0;
            if(customerPOPID != ''){
              objDetails = {
                  type: "TCustomerEx",
                  fields: {
                      ID: parseInt(customerPOPID) || 0,
                      Title: title,
                      ClientName: company,
                      FirstName: firstname,
                      CUSTFLD10: middlename,
                      LastName: lastname,
                      PublishOnVS1: true,
                      Email: email,
                      Phone: phone,
                      Mobile: mobile,
                      SkypeName: skype,
                      Faxnumber: fax,
                      ClientTypeName: customerType,
                      Street: streetAddress,
                      Street2: city,
                      Suburb: city,
                      State: state,
                      PostCode: postalcode,
                      Country: country,
                      BillStreet: bstreetAddress,
                      BillStreet2: bcity,
                      BillState: bstate,
                      BillPostCode: bzipcode,
                      Billcountry: bcountry,
                      IsSupplier:isSupplier,
                      Notes: notes,
                      URL: website,
                      PaymentMethodName: sltPaymentMethodName,
                      TermsName: sltTermsName,
                      ShippingMethodName: sltShippingMethodName,
                      TaxCodeName: sltTaxCodeName,
                      Attachments: uploadedItems,
                      CUSTFLD1: custField1,
                      CUSTFLD2: custField2,
                      CUSTFLD3: custField3,
                      CUSTFLD4: custField4,
                      Discount:parseFloat(permanentDiscount)||0
                  }
              };
            }else{
            let checkCustData = await contactService.getCheckCustomersData(company);
            if (checkCustData.tcustomer.length) {
                custdupID = checkCustData.tcustomer[0].Id;
                objDetails = {
                    type: "TCustomerEx",
                    fields: {
                        ID: custdupID || 0,
                        Title: title,
                        ClientName: company,
                        FirstName: firstname,
                        CUSTFLD10: middlename,
                        LastName: lastname,
                        PublishOnVS1: true,
                        Email: email,
                        Phone: phone,
                        Mobile: mobile,
                        SkypeName: skype,
                        Faxnumber: fax,
                        ClientTypeName: customerType,
                        Street: streetAddress,
                        Street2: city,
                        Suburb: city,
                        State: state,
                        PostCode: postalcode,
                        Country: country,
                        BillStreet: bstreetAddress,
                        BillStreet2: bcity,
                        BillState: bstate,
                        BillPostCode: bzipcode,
                        Billcountry: bcountry,
                        IsSupplier:isSupplier,
                        Notes: notes,
                        URL: website,
                        PaymentMethodName: sltPaymentMethodName,
                        TermsName: sltTermsName,
                        ShippingMethodName: sltShippingMethodName,
                        TaxCodeName: sltTaxCodeName,
                        Attachments: uploadedItems,
                        CUSTFLD1: custField1,
                        CUSTFLD2: custField2,
                        CUSTFLD3: custField3,
                        CUSTFLD4: custField4,
                        Discount:parseFloat(permanentDiscount)||0
                    }
                };
            } else {
                objDetails = {
                    type: "TCustomerEx",
                    fields: {
                        Title: title,
                        ClientName: company,
                        FirstName: firstname,
                        CUSTFLD10: middlename,
                        LastName: lastname,
                        PublishOnVS1: true,
                        Email: email,
                        Phone: phone,
                        Mobile: mobile,
                        SkypeName: skype,
                        Faxnumber: fax,
                        ClientTypeName: customerType,
                        Street: streetAddress,
                        Street2: city,
                        Suburb: city,
                        State: state,
                        PostCode: postalcode,
                        Country: country,
                        BillStreet: bstreetAddress,
                        BillStreet2: bcity,
                        BillState: bstate,
                        BillPostCode: bzipcode,
                        Billcountry: bcountry,
                        IsSupplier:isSupplier,
                        Notes: notes,
                        URL: website,
                        PaymentMethodName: sltPaymentMethodName,
                        TermsName: sltTermsName,
                        ShippingMethodName: sltShippingMethodName,
                        TaxCodeName: sltTaxCodeName,
                        Attachments: uploadedItems,
                        CUSTFLD1: custField1,
                        CUSTFLD2: custField2,
                        CUSTFLD3: custField3,
                        CUSTFLD4: custField4,
                        Discount:parseFloat(permanentDiscount)||0
                    }
                };
            };

          }


        contactService.saveCustomerEx(objDetails).then(function (objDetails) {
            let customerSaveID = objDetails.fields.ID;
            $('.fullScreenSpin').css('display', 'none');
            if (customerSaveID) {
                var currentLoc = FlowRouter.current().route.path;
                if (currentLoc == "/invoicecard" || currentLoc == "/quotecard" || currentLoc == "/salesordercard"|| currentLoc == "/refundcard") {
                    $('.salesmodule #edtCustomerName').val(company);
                    $('.salesmodule #edtCustomerEmail').val(email);
                    $('.salesmodule #edtCustomerEmail').attr('customerid', customerSaveID);
                    $('.salesmodule #edtCustomerEmail').attr('customerfirstname', firstname);
                    $('.salesmodule #edtCustomerEmail').attr('customerlastname', lastname);
                    $('.salesmodule #edtCustomerName').attr("custid", customerSaveID);
                    var postalAddress = company + '\n' + streetAddress + '\n' + city + ' ' + state + '\n' + country;
                    $('.salesmodule #txabillingAddress').val(postalAddress);
                    $('.salesmodule #pdfCustomerAddress').html(postalAddress);
                    $('.salesmodule .pdfCustomerAddress').text(postalAddress);
                    $('.salesmodule #txaShipingInfo').val(postalAddress);
                    $('.salesmodule #sltTerms').val(sltTermsName);
                }else if (currentLoc == "/billcard" || currentLoc == "/purchaseordercard") {
                    var selectLineID = $('#customerSelectLineID').val();
                    $('#' + selectLineID + " .lineCustomerJob").val(company);

                }else if (currentLoc == "/payrolloverview" ) {
                      $("#sltJob").text(company);
                }else if (currentLoc == "/timesheet") {
                    var selectLineID = $('#selectLineID').val();
                    if(selectLineID != ''){
                      $('#' + selectLineID + " .sltJobOne").text(company);
                    }else{
                      $("#sltJob").text(company);
                    }


                }else if (currentLoc == "/depositcard" ) {
                  var selectLineID = $('#customerSelectLineID').val();
                  $('#' + selectLineID + " .lineCompany").val(company);
                }else {
                    sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                        addVS1Data('TCustomerVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                            location.reload();
                        }).catch(function (err) {
                            location.reload();
                        });
                    }).catch(function (err) {
                        location.reload();
                    });
                }

                $('#addCustomerModal').modal('toggle');
                sideBarService.getAllCustomersDataVS1(initialBaseDataLoad, 0).then(function (dataReload) {
                    addVS1Data('TCustomerVS1', JSON.stringify(dataReload)).then(function (datareturn) {

                    }).catch(function (err) {
                    });
                }).catch(function (err) {
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
            $('.fullScreenSpin').css('display', 'none');
        });

    },
    'click .btnSaveJob': function (event) {
        let templateObject = Template.instance();
        let contactService = new ContactService();
        $('.fullScreenSpin').css('display', 'inline-block');

        let companyJob = $('#edtJobCustomerCompany').val();
        let companyParent = $('#edtParentJobCustomerCompany').val();

        let addressValid = false;
        let emailJob = $('#edtJobCustomerEmail').val();
        let titleJob = $('#edtJobTitle').val();
        let firstnameJob = $('#edtJobFirstName').val();
        let middlenameJob = $('#edtJobMiddleName').val();
        let lastnameJob = $('#edtJobLastName').val();
        // let suffixJob = $('#edtSuffix').val();
        let phoneJob = $('#edtJobCustomerPhone').val();
        let mobileJob = $('#edtJobCustomerMobile').val();
        let faxJob = $('#edtJobCustomerFax').val();
        // let accountnoJob = $('#edtClientNo').val();
        let skypeJob = $('#edtJobCustomerSkypeID').val();
        let websiteJob = $('#edtJobCustomerWebsite').val();

        let jobTitle = $('#edtJob_Title').val();
        let jobName = $('#edtJobName').val();
        let jobNumber = $('#edtJobNumber').val();
        let jobReg = $('#edtJobReg').val();



        let bstreetAddressJob = '';
        let bcityJob = '';
        let bstateJob = '';
        let bzipcodeJob = '';
        let bcountryJob = '';

        let streetAddressJob = '';
        let cityJob = '';
        let stateJob = '';
        let postalcodeJob = '';
        let countryJob = '';

        if ($('#chkJobSameAsShipping2').is(':checked')) {


            streetAddressJob = $('.tab-Job4 #edtJobCustomerShippingAddress').val();
            cityJob = $('.tab-Job4 #edtJobCustomerShippingCity').val();
            stateJob = $('.tab-Job4 #edtJobCustomerShippingState').val();
            postalcodeJob = $('.tab-Job4 #edtJobCustomerShippingZIP').val();
            countryJob = $('.tab-Job4 #sedtJobCountry').val();

            bstreetAddressJob = streetAddressJob;
            bcityJob = cityJob;
            bstateJob = stateJob;
            bzipcodeJob = postalcodeJob;
            bcountryJob = countryJob;
            addressValid = true;
        } else if ($('#chkJobSameAsShipping2NoPOP').is(':checked')) {
            streetAddressJob = $('#edtJobCustomerShippingAddress').val();
            cityJob = $('#edtJobCustomerShippingCity').val();
            stateJob = $('#edtJobCustomerShippingState').val();
            postalcodeJob = $('#edtJobCustomerShippingZIP').val();
            countryJob = $('#sedtJobCountry').val();

            bstreetAddressJob = streetAddressJob;
            bcityJob = cityJob;
            bstateJob = stateJob;
            bzipcodeJob = postalcodeJob;
            bcountryJob = countryJob;
        } else {
            bstreetAddressJob = $('#edtCustomerBillingAddress').val();
            bcityJob = $('#edtJobCustomerBillingCity').val();
            bstateJob = $('#edtJobCustomerBillingState').val();
            bzipcodeJob = $('#edtJobCustomerBillingZIP').val();
            bcountryJob = $('#sJobedtCountry').val();
        }



        let sltPaymentMethodNameJob = $('#sltJobPreferedPayment').val() || 'Cash';
        let sltTermsNameJob = $('#sltJobTerms').val();
        let sltShippingMethodNameJob = $('#sltJobDeliveryMethod').val();
        let rewardPointsOpeningBalanceJob = $('#custJobOpeningBalance').val();

        var sltRewardPointsOpeningDateJob = new Date($("#dtJobAsOf").datepicker("getDate"));

        let openingDateJob = sltRewardPointsOpeningDateJob.getFullYear() + "-" + (sltRewardPointsOpeningDateJob.getMonth() + 1) + "-" + sltRewardPointsOpeningDateJob.getDate();

        // let sltTaxCodeNameJob =  $('#sltJobTaxCode').val();
        let uploadedItemsJob = templateObject.uploadedFilesJob.get();
        let uploadedItemsJobNoPOP = templateObject.uploadedFilesJobNoPOP.get();


        let sltTaxCodeNameJob = "";

        let isChecked = $(".chkJobTaxExempt").is(":checked");
        if (isChecked) {
            sltTaxCodeNameJob = "NT";
        } else {
            sltTaxCodeNameJob = $('#sltJobTaxCode').val();
        }


        let notesJob = $('#txaJobNotes').val();

        var objDetails = '';
        var url = FlowRouter.current().path;
        var getemp_id = url.split('?jobid=');
        var currentEmployeeJob = getemp_id[getemp_id.length - 1];
        var objDetails = '';
        if (getemp_id[1]) {

            objDetails = {
                type: "TJobEx",
                fields: {
                    ID: currentEmployeeJob,
                    Title: $('.jobTabEdit #edtJobTitle').val() || '',
                    //clientName:companyJob,
                    ParentClientName: $('.jobTabEdit #edtParentJobCustomerCompany').val() || '',
                    ParentCustomerName: $('.jobTabEdit #edtParentJobCustomerCompany').val() || '',
                    FirstName: $('.jobTabEdit #edtJobFirstName').val() || '',
                    MiddleName: $('.jobTabEdit #edtJobMiddleName').val() || '',
                    LastName: $('.jobTabEdit #edtJobLastName').val() || '',
                    Email: $('.jobTabEdit #edtJobCustomerEmail').val() || '',
                    Phone: $('.jobTabEdit #edtJobCustomerPhone').val() || '',
                    Mobile: $('.jobTabEdit #edtJobCustomerMobile').val() || '',
                    SkypeName: $('.jobTabEdit #edtJobCustomerSkypeID').val() || '',
                    Street: streetAddressJob,
                    Street2: cityJob,
                    State: stateJob,
                    PostCode: postalcodeJob,
                    Country: $('.tab-Job4 #sedtJobCountry').val(),
                    BillStreet: bstreetAddressJob,
                    BillStreet2: bcityJob,
                    BillState: bstateJob,
                    BillPostCode: bzipcodeJob,
                    Billcountry: bcountryJob,
                    Notes: $('.tab-Job5 #txaJobNotes').val(),
                    CUSTFLD9: $('.jobTabEdit #edtJobCustomerWebsite').val() || '',
                    PaymentMethodName: sltPaymentMethodNameJob,
                    TermsName: sltTermsNameJob,
                    ShippingMethodName: sltShippingMethodNameJob,
                    // RewardPointsOpeningBalance:parseInt(rewardPointsOpeningBalanceJob),
                    // RewardPointsOpeningDate:openingDateJob,
                    TaxCodeName: sltTaxCodeNameJob,
                    // JobName:$('.jobTabEdit #edtJobName').val() || '',
                    Faxnumber: $('.jobTabEdit #edtJobCustomerFax').val() || '',
                    JobNumber: parseInt($('.jobTabEdit #edtJobNumber').val()) || 0,
                    // JobRegistration:$('.jobTabEdit #edtJobReg').val() || '',
                    // JobTitle:$('.jobTabEdit #edtJob_Title').val() || '',
                    Attachments: uploadedItemsJobNoPOP

                }
            };
        } else {
            objDetails = {
                type: "TJobEx",
                fields: {
                    Title: titleJob,
                    //clientName:companyJob,
                    ParentClientName: companyParent,
                    ParentCustomerName: companyParent,
                    FirstName: firstnameJob,
                    MiddleName: middlenameJob,
                    LastName: lastnameJob,
                    Email: emailJob,
                    Phone: phoneJob,
                    Mobile: mobileJob,
                    SkypeName: skypeJob,
                    Street: streetAddressJob,
                    Street2: cityJob,
                    State: stateJob,
                    PostCode: postalcodeJob,
                    Country: countryJob,
                    BillStreet: bstreetAddressJob,
                    BillStreet2: bcityJob,
                    BillState: bstateJob,
                    BillPostCode: bzipcodeJob,
                    Billcountry: bcountryJob,
                    Notes: notesJob,
                    CUSTFLD9: websiteJob,
                    PaymentMethodName: sltPaymentMethodNameJob,
                    TermsName: sltTermsNameJob,
                    ShippingMethodName: sltShippingMethodNameJob,
                    // RewardPointsOpeningBalance:parseInt(rewardPointsOpeningBalanceJob),
                    // RewardPointsOpeningDate:openingDateJob,
                    TaxCodeName: sltTaxCodeNameJob,
                    Faxnumber: faxJob,
                    JobName: jobName,
                    JobNumber: parseFloat(jobNumber) || 0,
                    // JobRegistration:jobReg,
                    // JobTitle:jobTitle,
                    Attachments: uploadedItemsJob

                }
            };
        }

        contactService.saveJobEx(objDetails).then(function (objDetails) {
            sideBarService.getAllJobssDataVS1(initialBaseDataLoad,0).then(function (dataReload) {
                addVS1Data('TJobVS1', JSON.stringify(dataReload)).then(function (datareturn) {
                    FlowRouter.go('/joblist?success=true');
                }).catch(function (err) {
                    FlowRouter.go('/joblist?success=true');
                });
            }).catch(function (err) {
                FlowRouter.go('/joblist?success=true');
            });

            sideBarService.getAllCustomersDataVS1(initialBaseDataLoad,0).then(function (dataReload) {
                addVS1Data('TCustomerVS1', JSON.stringify(dataReload)).then(function (datareturn) {

                }).catch(function (err) {

                });
            }).catch(function (err) {

            });
            // let customerSaveID = FlowRouter.current().queryParams;
            //   if(!isNaN(customerSaveID.id)){
            //         window.open('/customerscard?id=' + customerSaveID,'_self');
            //    }else if(!isNaN(customerSaveID.jobid)){
            //      window.open('/customerscard?jobid=' + customerSaveID,'_self');
            //    }else{
            //
            //    }
        }).catch(function (err) {
            swal({
                title: 'Oooops...',
                text: err,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'Try Again'
            }).then((result) => {
                if (result.value) {
                    //Meteor._reload.reload();
                } else if (result.dismiss === 'cancel') {

                }
            });

        });

    },

    'keyup .search': function (event) {
        var searchTerm = $(".search").val();
        var listItem = $('.results tbody').children('tr');
        var searchSplit = searchTerm.replace(/ /g, "'):containsi('");

        $.extend($.expr[':'], {
            'containsi': function (elem, i, match, array) {
                return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
            }
        });

        $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'false');
        });

        $(".results tbody tr:containsi('" + searchSplit + "')").each(function (e) {
            $(this).attr('visible', 'true');
        });

        var jobCount = $('.results tbody tr[visible="true"]').length;
        $('.counter').text(jobCount + ' items');

        if (jobCount == '0') { $('.no-result').show(); }
        else {
            $('.no-result').hide();
        }
        if (searchTerm === "") {
            $(".results tbody tr").each(function (e) {
                $(this).attr('visible', 'true');
                $('.no-result').hide();
            });

            //setTimeout(function () {
            var rowCount = $('.results tbody tr').length;
            $('.counter').text(rowCount + ' items');
            //}, 500);
        }

    },
    'click .tblCustomerSideList tbody tr': function (event) {

        var custLineID = $(event.target).attr('id');
        var custLineClass = $(event.target).attr('class');

        if (custLineID) {
            if (custLineClass == 'true') {
                window.open('/customerscard?jobid=' + custLineID, '_self');
            } else {
                window.open('/customerscard?id=' + custLineID, '_self');
            }

        }
    },
    'click .chkDatatable': function (event) {
        var columns = $('#tblTransactionlist th');
        let columnDataValue = $(event.target).closest("div").find(".divcolumn").text();

        $.each(columns, function (i, v) {
            let className = v.classList;
            let replaceClass = className[1];

            if (v.innerText == columnDataValue) {
                if ($(event.target).is(':checked')) {
                    $("." + replaceClass + "").css('display', 'table-cell');
                    $("." + replaceClass + "").css('padding', '.75rem');
                    $("." + replaceClass + "").css('vertical-align', 'top');
                } else {
                    $("." + replaceClass + "").css('display', 'none');
                }
            }
        });
    },
    'click .resetTable': function (event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblTransactionlist' });
                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
                        if (err) {

                        } else {
                            Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .saveTable': function (event) {
        let lineItems = [];
        //let datatable =$('#tblTransactionlist').DataTable();
        $('.columnSettings').each(function (index) {
            var $tblrow = $(this);
            var colTitle = $tblrow.find(".divcolumn").text() || '';
            var colWidth = $tblrow.find(".custom-range").val() || 0;
            var colthClass = $tblrow.find(".divcolumn").attr("valueupdate") || '';
            var colHidden = false;
            if ($tblrow.find(".custom-control-input").is(':checked')) {
                colHidden = false;
            } else {
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

        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'tblTransactionlist' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            userid: clientID, username: clientUsername, useremail: clientEmail,
                            PrefGroup: 'salesform', PrefName: 'tblTransactionlist', published: true,
                            customFields: lineItems,
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#myModal2').modal('toggle');
                        } else {
                            $('#myModal2').modal('toggle');
                        }
                    });

                } else {
                    CloudPreference.insert({
                        userid: clientID, username: clientUsername, useremail: clientEmail,
                        PrefGroup: 'salesform', PrefName: 'tblTransactionlist', published: true,
                        customFields: lineItems,
                        createdAt: new Date()
                    }, function (err, idTag) {
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
    'blur .divcolumn': function (event) {
        let columData = $(event.target).text();

        let columnDatanIndex = $(event.target).closest("div.columnSettings").attr('id');

        var datable = $('#tblTransactionlist').DataTable();
        var title = datable.column(columnDatanIndex).header();
        $(title).html(columData);

    },
    'change .rngRange': function (event) {
        let range = $(event.target).val();
        // $(event.target).closest("div.divColWidth").find(".spWidth").html(range+'px');

        // let columData = $(event.target).closest("div.divColWidth").find(".spWidth").attr("value");
        let columnDataValue = $(event.target).closest("div").prev().find(".divcolumn").text();
        var datable = $('#tblTransactionlist th');
        $.each(datable, function (i, v) {
            if (v.innerText == columnDataValue) {
                let className = v.className;
                let replaceClass = className.replace(/ /g, ".");
                $("." + replaceClass + "").css('width', range + 'px');

            }
        });

    },
    'click .btnOpenSettingsCustomer': function (event) {
        let templateObject = Template.instance();
        var columns = $('#tblTransactionlist th');

        const tableHeaderList = [];
        let sTible = "";
        let sWidth = "";
        let sIndex = "";
        let sVisible = "";
        let columVisible = false;
        let sClass = "";
        $.each(columns, function (i, v) {
            if (v.hidden == false) {
                columVisible = true;
            }
            if ((v.className.includes("hiddenColumn"))) {
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
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletocsv').click();


    },
    'click .printConfirm': function (event) {

        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblTransactionlist_wrapper .dt-buttons .btntabletopdf').click();

    },
    'click #exportbtnJob': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblJoblist_wrapper .dt-buttons .btntabletocsv').click();

    },
    'click .printConfirmJob': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        jQuery('#tblJoblist_wrapper .dt-buttons .btntabletopdf').click();

    },
    'click .btnRefresh': function () {
        Meteor._reload.reload();
    },
    'click .btnRefreshTransaction': function () {
        let currentId = FlowRouter.current().queryParams;
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getTTransactionListReport().then(function (data) {
            addVS1Data('TTransactionListReport', JSON.stringify(data)).then(function (datareturn) {
                if (!isNaN(currentId.jobid)) {
                    window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=active', '_self');
                }

                if (!isNaN(currentId.id)) {
                    window.open('/customerscard?id=' + currentId.id +'&transTab=active', '_self');
                }

            }).catch(function (err) {
                if (!isNaN(currentId.jobid)) {
                    window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=active', '_self');
                }

                if (!isNaN(currentId.id)) {
                    window.open('/customerscard?id=' + currentId.id +'&transTab=active', '_self');
                }
            });
        }).catch(function (err) {
            if (!isNaN(currentId.jobid)) {
                window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=active', '_self');
            }

            if (!isNaN(currentId.id)) {
                window.open('/customerscard?id=' + currentId.id +'&transTab=active', '_self');
            }
        });
    },
    'click .btnRefreshJobDetails': function () {
        let currentId = FlowRouter.current().queryParams;
        $('.fullScreenSpin').css('display', 'inline-block');
        sideBarService.getAllJobssDataVS1(initialBaseDataLoad,0).then(function (data) {
            addVS1Data('TJobVS1', JSON.stringify(data)).then(function (datareturn) {
                if (!isNaN(currentId.jobid)) {
                    window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=job', '_self');
                }

                if (!isNaN(currentId.id)) {
                    window.open('/customerscard?id=' + currentId.id +'&transTab=job', '_self');
                }

            }).catch(function (err) {
                if (!isNaN(currentId.jobid)) {
                    window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=job', '_self');
                }

                if (!isNaN(currentId.id)) {
                    window.open('/customerscard?id=' + currentId.id +'&transTab=job', '_self');
                }
            });
        }).catch(function (err) {
            if (!isNaN(currentId.jobid)) {
                window.open('/customerscard?jobid=' + currentId.jobid +'&transTab=job', '_self');
            }

            if (!isNaN(currentId.id)) {
                window.open('/customerscard?id=' + currentId.id +'&transTab=job', '_self');
            }
        });
    },
    'click #formCheck-TaxCode': function () {
        if ($(event.target).is(':checked')) {
            $('#autoUpdate').css('display', 'none');
        } else {
            $('#autoUpdate').css('display', 'block');
        }
    },

    'click #formCheckJob-2': function () {
        if ($(event.target).is(':checked')) {
            $('#autoUpdateJob').css('display', 'none');
        } else {
            $('#autoUpdateJob').css('display', 'block');
        }
    },

    'click #activeChk': function () {
        if ($(event.target).is(':checked')) {
            $('#customerInfo').css('color', '#00A3D3');
        } else {
            $('#customerInfo').css('color', '#b7b9cc !important');
        }
    },

    'click #btnNewProject': function (event) {
        var x2 = document.getElementById("newProject");
        if (x2.style.display === "none") {
            x2.style.display = "block";
        } else {
            x2.style.display = "none";
        }
    },
    'keydown #custOpeningBalance, keydown #edtJobNumber, keydown #edtCustomerCardDiscount': function (event) {
        if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||333
            // Allow: Ctrl+A, Command+A
            (event.keyCode === 65 && (event.ctrlKey === true || event.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (event.keyCode >= 35 && event.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }

        if (event.shiftKey == true) {
            event.preventDefault();
        }

        if ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 96 && event.keyCode <= 105) ||
            event.keyCode == 8 || event.keyCode == 9 ||
            event.keyCode == 37 || event.keyCode == 39 ||
            event.keyCode == 46 || event.keyCode == 190 || event.keyCode == 189) {
        } else {
            event.preventDefault();
        }
    },
    'click .new_attachment_btn': function (event) {
        $('#attachment-upload').trigger('click');

    },
    'click #formCheck-one': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox1div').css('display', 'block');

        } else {
            $('.checkbox1div').css('display', 'none');
        }
    },
    'click #formCheck-two': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox2div').css('display', 'block');

        } else {
            $('.checkbox2div').css('display', 'none');
        }
    },
    'click #formCheck-three': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox3div').css('display', 'block');

        } else {
            $('.checkbox3div').css('display', 'none');
        }
    },
    'click #formCheck-four': function (event) {
        if ($(event.target).is(':checked')) {
            $('.checkbox4div').css('display', 'block');

        } else {
            $('.checkbox4div').css('display', 'none');
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
    'click .btnSaveSettings': function (event) {
        let templateObject = Template.instance();
        $('.lblCustomField1').html('');
        $('.lblCustomField2').html('');
        $('.lblCustomField3').html('');
        $('.lblCustomField4').html('');
        let getchkcustomField1 = true;
        let getchkcustomField2 = true;
        let getchkcustomField3 = true;
        let getchkcustomField4 = true;
        let getcustomField1 = $('.customField1Text').html();
        let getcustomField2 = $('.customField2Text').html();
        let getcustomField3 = $('.customField3Text').html();
        let getcustomField4 = $('.customField4Text').html();
        if ($('#formCheck-one').is(':checked')) {
            getchkcustomField1 = false;
        }
        if ($('#formCheck-two').is(':checked')) {
            getchkcustomField2 = false;
        }
        if ($('#formCheck-three').is(':checked')) {
            getchkcustomField3 = false;
        }
        if ($('#formCheck-four').is(':checked')) {
            getchkcustomField4 = false;
        }

        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'customerscard' });
                if (checkPrefDetails) {
                    CloudPreference.update({ _id: checkPrefDetails._id }, {
                        $set: {
                            username: clientUsername, useremail: clientEmail,
                            PrefGroup: 'contactform', PrefName: 'customerscard', published: true,
                            customFields: [{
                                index: '1',
                                label: getcustomField1,
                                hidden: getchkcustomField1
                            }, {
                                index: '2',
                                label: getcustomField2,
                                hidden: getchkcustomField2
                            }, {
                                index: '3',
                                label: getcustomField3,
                                hidden: getchkcustomField3
                            }, {
                                index: '4',
                                label: getcustomField4,
                                hidden: getchkcustomField4
                            }
                                          ],
                            updatedAt: new Date()
                        }
                    }, function (err, idTag) {
                        if (err) {
                            $('#customfieldModal').modal('toggle');
                        } else {
                            $('#customfieldModal').modal('toggle');
                            $('.btnSave').trigger('click');
                        }
                    });
                } else {
                    CloudPreference.insert({
                        userid: clientID, username: clientUsername, useremail: clientEmail,
                        PrefGroup: 'contactform', PrefName: 'customerscard', published: true,
                        customFields: [{
                            index: '1',
                            label: getcustomField1,
                            hidden: getchkcustomField1
                        }, {
                            index: '2',
                            label: getcustomField2,
                            hidden: getchkcustomField2
                        }, {
                            index: '3',
                            label: getcustomField3,
                            hidden: getchkcustomField3
                        }, {
                            index: '4',
                            label: getcustomField4,
                            hidden: getchkcustomField4
                        }
                                      ],
                        createdAt: new Date()
                    }, function (err, idTag) {
                        if (err) {
                            $('#customfieldModal').modal('toggle');
                        } else {
                            $('#customfieldModal').modal('toggle');
                            $('.btnSave').trigger('click');

                        }
                    });
                }
            }
        }

    },
    'click .btnResetSettings': function (event) {
        var getcurrentCloudDetails = CloudUser.findOne({ _id: Session.get('mycloudLogonID'), clouddatabaseID: Session.get('mycloudLogonDBID') });
        if (getcurrentCloudDetails) {
            if (getcurrentCloudDetails._id.length > 0) {
                var clientID = getcurrentCloudDetails._id;
                var clientUsername = getcurrentCloudDetails.cloudUsername;
                var clientEmail = getcurrentCloudDetails.cloudEmail;
                var checkPrefDetails = CloudPreference.findOne({ userid: clientID, PrefName: 'customerscard' });

                if (checkPrefDetails) {
                    CloudPreference.remove({ _id: checkPrefDetails._id }, function (err, idTag) {
                        if (err) {

                        } else {
                            let customerSaveID = FlowRouter.current().queryParams;
                            if (!isNaN(customerSaveID.id)) {
                                window.open('/customerscard?id=' + customerSaveID, '_self');
                            } else if (!isNaN(customerSaveID.jobid)) {
                                window.open('/customerscard?jobid=' + customerSaveID, '_self');
                            } else {
                                window.open('/customerscard', '_self');
                            }
                            //Meteor._reload.reload();
                        }
                    });

                }
            }
        }
    },
    'click .new_attachment_btn': function (event) {
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
    'click .img_new_attachment_btn': function (event) {
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
    'click .remove-attachment': function (event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachment-')[1]);
        if (tempObj.$("#confirm-action-" + attachmentID).length) {
            tempObj.$("#confirm-action-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-action" id="confirm-action-' + attachmentID + '"><a class="confirm-delete-attachment btn btn-default" id="delete-attachment-' + attachmentID + '">'
            + 'Delete</a><button class="save-to-library btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-name-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltip").show();

    },
    'click .file-name': function (event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-name-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFiles.get();

        $('#myModalAttachment').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        }
        else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        }
        else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        }
        else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFile.set(previewFile);

        $('#files_view').modal('show');

        return;
    },
    'click .confirm-delete-attachment': function (event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltip").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachment-')[1]);
        let uploadedArray = tempObj.uploadedFiles.get();
        let attachmentCount = tempObj.attachmentCount.get();
        $('#attachment-upload').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFiles.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-display').html(elementToAdd);
        }
        tempObj.attachmentCount.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentTabs(uploadedArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .attachmentTab': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFiles.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentTabs(uploadedFileArray);
        } else {
            $(".attchment-tooltip").show();
        }
    },
    'click .new_attachment_btnJobPOP': function (event) {
        $('#attachment-uploadJobPOP').trigger('click');

    },
    'change #attachment-uploadJobPOP': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArray = templateObj.uploadedFilesJob.get();


        let myFiles = $('#attachment-uploadJobPOP')[0].files;

        let uploadData = utilityService.attachmentUploadJob(uploadedFilesArray, myFiles, saveToTAttachment, lineIDForAttachment);

        templateObj.uploadedFilesJob.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCountJob.set(uploadData.totalAttachments);
    },
    'click .remove-attachmentJobPOP': function (event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachmentJobPOP-')[1]);
        if (tempObj.$("#confirm-actionJobPOP-" + attachmentID).length) {
            tempObj.$("#confirm-actionJobPOP-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-actionJobPOP" id="confirm-actionJobPOP-' + attachmentID + '"><a class="confirm-delete-attachmentJobPOP btn btn-default" id="delete-attachmentJobPOP-' + attachmentID + '">'
            + 'Delete</a><button class="save-to-libraryJobPOP btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-nameJobPOP-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltipJobPOP").show();

    },
    'click .file-nameJobPOP': function (event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-nameJobPOP-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFilesJob.get();

        $('#myModalAttachmentJobPOP').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        }
        else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        }
        else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        }
        else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFileJob.set(previewFile);

        $('#files_viewJobPOP').modal('show');

        return;
    },
    'click .confirm-delete-attachmentJobPOP': function (event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltipJobPOP").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachmentJobPOP-')[1]);
        let uploadedArray = tempObj.uploadedFilesJob.get();
        let attachmentCount = tempObj.attachmentCountJob.get();
        $('#attachment-uploadJobPOP').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFilesJob.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-displayJobPOP').html(elementToAdd);
        }
        tempObj.attachmentCountJob.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentJob(uploadedArray);
        } else {
            $(".attchment-tooltipJobPOP").show();
        }
    },
    'click .attachmentTabJobPOP': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFilesJob.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentJob(uploadedFileArray);
        } else {
            $(".attchment-tooltipJobPOP").show();
        }
    },
    'click .new_attachment_btnJobNoPOP': function (event) {
        $('#attachment-uploadJobNoPOP').trigger('click');

    },
    'change #attachment-uploadJobNoPOP': function (e) {
        let templateObj = Template.instance();
        let saveToTAttachment = false;
        let lineIDForAttachment = false;
        let uploadedFilesArrayJob = templateObj.uploadedFilesJobNoPOP.get();


        let myFiles = $('#attachment-uploadJobNoPOP')[0].files;

        let uploadData = utilityService.attachmentUploadJobNoPOP(uploadedFilesArrayJob, myFiles, saveToTAttachment, lineIDForAttachment);


        templateObj.uploadedFilesJobNoPOP.set(uploadData.uploadedFilesArray);
        templateObj.attachmentCountJobNoPOP.set(uploadData.totalAttachments);
    },
    'click .remove-attachmentJobNoPOP': function (event, ui) {
        let tempObj = Template.instance();
        let attachmentID = parseInt(event.target.id.split('remove-attachmentJobNoPOP-')[1]);
        if (tempObj.$("#confirm-actionJobNoPOP-" + attachmentID).length) {
            tempObj.$("#confirm-actionJobNoPOP-" + attachmentID).remove();
        } else {
            let actionElement = '<div class="confirm-actionJobNoPOP" id="confirm-actionJobNoPOP-' + attachmentID + '"><a class="confirm-delete-attachmentJobNoPOP btn btn-default" id="delete-attachmentJobNoPOP-' + attachmentID + '">'
            + 'Delete</a><button class="save-to-libraryJobNoPOP btn btn-default">Remove & save to File Library</button></div>';
            tempObj.$('#attachment-nameJobNoPOP-' + attachmentID).append(actionElement);
        }
        tempObj.$("#new-attachment2-tooltipJobNoPOP").show();

    },
    'click .file-nameJobNoPOP': function (event) {
        let attachmentID = parseInt(event.currentTarget.parentNode.id.split('attachment-nameJobNoPOP-')[1]);
        let templateObj = Template.instance();
        let uploadedFiles = templateObj.uploadedFilesJobNoPOP.get();

        //$('#myModalAttachmentJobNoPOP').modal('hide');
        let previewFile = {};
        let input = uploadedFiles[attachmentID].fields.Description;
        previewFile.link = 'data:' + input + ';base64,' + uploadedFiles[attachmentID].fields.Attachment;
        previewFile.name = uploadedFiles[attachmentID].fields.AttachmentName;
        let type = uploadedFiles[attachmentID].fields.Description;
        if (type === 'application/pdf') {
            previewFile.class = 'pdf-class';
        } else if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            previewFile.class = 'docx-class';
        }
        else if (type === 'application/vnd.ms-excel' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            previewFile.class = 'excel-class';
        }
        else if (type === 'application/vnd.ms-powerpoint' || type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            previewFile.class = 'ppt-class';
        }
        else if (type === 'application/vnd.oasis.opendocument.formula' || type === 'text/csv' || type === 'text/plain' || type === 'text/rtf') {
            previewFile.class = 'txt-class';
        }
        else if (type === 'application/zip' || type === 'application/rar' || type === 'application/x-zip-compressed' || type === 'application/x-zip,application/x-7z-compressed') {
            previewFile.class = 'zip-class';
        }
        else {
            previewFile.class = 'default-class';
        }

        if (type.split('/')[0] === 'image') {
            previewFile.image = true
        } else {
            previewFile.image = false
        }
        templateObj.uploadedFileJobNoPOP.set(previewFile);

        $('#files_viewJobNoPOP').modal('show');

        return;
    },
    'click .confirm-delete-attachmentJobNoPOP': function (event, ui) {
        let tempObj = Template.instance();
        tempObj.$("#new-attachment2-tooltipJobNoPOP").show();
        let attachmentID = parseInt(event.target.id.split('delete-attachmentJobNoPOP-')[1]);
        let uploadedArray = tempObj.uploadedFilesJobNoPOP.get();
        let attachmentCount = tempObj.attachmentCountJobNoPOP.get();
        $('#attachment-uploadJobNoPOP').val('');
        uploadedArray.splice(attachmentID, 1);
        tempObj.uploadedFilesJobNoPOP.set(uploadedArray);
        attachmentCount--;
        if (attachmentCount === 0) {
            let elementToAdd = '<div class="col inboxcol1"><img src="/icons/nofiles_icon.jpg" class=""></div> <div class="col inboxcol2"> <div>Upload  files or add files from the file library</div> <p style="color: #ababab;">Only users with access to your company can view these files</p></div>';
            $('#file-displayJobNoPOP').html(elementToAdd);
        }
        tempObj.attachmentCountJobNoPOP.set(attachmentCount);
        if (uploadedArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentJobNoPOP(uploadedArray);
        } else {
            $(".attchment-tooltipJobNoPOP").show();
        }
    },
    'click .attachmentTabJobNoPOP': function () {
        let templateInstance = Template.instance();
        let uploadedFileArray = templateInstance.uploadedFilesJobNoPOP.get();
        if (uploadedFileArray.length > 0) {
            let utilityService = new UtilityService();
            utilityService.showUploadedAttachmentJobNoPOP(uploadedFileArray);
        } else {
            $(".attchment-tooltipJobNoPOP").show();
        }
    },
    'change .customerTypeSelect': function (event) {
        var custName = $('.customerTypeSelect').children("option:selected").val();
        if (custName == "newCust") {
            $('#myModalClientType').modal();
            $(this).prop("selected", false);
        }
    },
    'click #btnNewJob': function (event) {
        let templateObject = Template.instance();
    },
    'click .btnNewCustomer': function (event) {
        window.open('/customerscard', '_self');
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
    'click .btnDeleteCustomer': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');

        let templateObject = Template.instance();
        let contactService2 = new ContactService();

        let currentId = FlowRouter.current().queryParams;
        var objDetails = '';

        if (!isNaN(currentId.id)) {
            currentCustomer = parseInt(currentId.id);
            objDetails = {
                type: "TCustomerEx",
                fields: {
                    ID: currentCustomer,
                    Active: false
                }
            };

            contactService2.saveCustomerEx(objDetails).then(function (objDetails) {
                FlowRouter.go('/customerlist?success=true');
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

            });
        } else {
            FlowRouter.go('/customerlist?success=true');
        }
        $('#deleteCustomerModal').modal('toggle');
    }
});

Template.addcustomerpop.helpers({
    record: () => {
        return Template.instance().records.get();
    },
    countryList: () => {
        return Template.instance().countryData.get();
    },
    customerrecords: () => {
        return Template.instance().customerrecords.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            }
            else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecords: () => {
        return Template.instance().datatablerecords.get().sort(function (a, b) {
            if (a.saledate == 'NA') {
                return 1;
            }
            else if (b.saledate == 'NA') {
                return -1;
            }
            return (a.saledate.toUpperCase() > b.saledate.toUpperCase()) ? 1 : -1;
        });
    },
    datatablerecordsjob: () => {
        return Template.instance().datatablerecordsjob.get().sort(function (a, b) {
            if (a.company == 'NA') {
                return 1;
            }
            else if (b.company == 'NA') {
                return -1;
            }
            return (a.company.toUpperCase() > b.company.toUpperCase()) ? 1 : -1;
        });
    },
    tableheaderrecords: () => {
        return Template.instance().tableheaderrecords.get();
    },
    tableheaderrecordsjob: () => {
        return Template.instance().tableheaderrecordsjob.get();
    },
    salesCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'tblSalesOverview' });
    },
    currentdate: () => {
        var currentDate = new Date();
        var begunDate = moment(currentDate).format("DD/MM/YYYY");
        return begunDate;
    },
    isJob: () => {
        return Template.instance().isJob.get();
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
    clienttypeList: () => {
        return Template.instance().clienttypeList.get().sort(function (a, b) {
            if (a == 'NA') {
                return 1;
            }
            else if (b == 'NA') {
                return -1;
            }
            return (a.toUpperCase() > b.toUpperCase()) ? 1 : -1;
        });
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
    uploadedFilesJob: () => {
        return Template.instance().uploadedFilesJob.get();
    },
    attachmentCountJob: () => {
        return Template.instance().attachmentCountJob.get();
    },
    uploadedFileJob: () => {
        return Template.instance().uploadedFileJob.get();
    },
    uploadedFilesJobNoPOP: () => {
        return Template.instance().uploadedFilesJobNoPOP.get();
    },
    attachmentCountJobNoPOP: () => {
        return Template.instance().attachmentCountJobNoPOP.get();
    },
    uploadedFileJobNoPOP: () => {
        return Template.instance().uploadedFileJobNoPOP.get();
    },
    currentAttachLineID: () => {
        return Template.instance().currentAttachLineID.get();
    },
    contactCloudPreferenceRec: () => {
        return CloudPreference.findOne({ userid: Session.get('mycloudLogonID'), PrefName: 'customerscard' });
    },
    isSameAddress: () => {
        return Template.instance().isSameAddress.get();
    },
    isJobSameAddress: () => {
        return Template.instance().isJobSameAddress.get();
    },
    isMobileDevices: () => {
        var isMobile = false; //initiate as false
        // device detection
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }

        return isMobile;
    }
});
