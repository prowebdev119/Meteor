import {
    ReactiveVar
}
from 'meteor/reactive-var';
import {
    UtilityService
}
from "../utility-service";
let utilityService = new UtilityService();
Template.companyappsettingsdup.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.recordscomp = new ReactiveVar();
    templateObject.recordscompaccess = new ReactiveVar();

    templateObject.simplestartArr = new ReactiveVar();
    templateObject.essentailsArr = new ReactiveVar();
    templateObject.plusArr = new ReactiveVar();
    templateObject.extraArr = new ReactiveVar();
    templateObject.monthArr = new ReactiveVar();

    templateObject.recordpackType = new ReactiveVar();

    templateObject.employeecompaccess = new ReactiveVar();

});

Template.companyappsettingsdup.onRendered(function () {
    $('.fullScreenSpin').css('display', 'inline-block');
    const templateObject = Template.instance();
    const recordscompaccess = [];
    const simplestartArr = [];
    const essentailsArr = [];
    const plusArr = [];
    const extraArr = [];
    const monthArr = [];
    let getPackType = "";

    var erpGet = erpDb();
    Meteor.call('magentoAWSProfileLoggedUser', erpGet.ERPUsername, function (error, result) {
        if (error) {}
        else {
            if (result) {
                let valueData = result.items;
                for (let j in valueData) {
                    if (valueData[j].items[0].sku == "vs1_simplestart_trial") {
                        getPackType = "trialPack";
                        templateObject.recordpackType.set(getPackType);
                    } else if (valueData[j].items[0].sku == "vs1_essentials_trial") {
                        getPackType = "trialPack";
                        templateObject.recordpackType.set(getPackType);
                    } else if (valueData[j].items[0].sku == "vs1_plus_trial") {
                        getPackType = "trialPack";
                        templateObject.recordpackType.set(getPackType);
                    } else if (valueData[j].items[0].sku == "vs1_simplestart_sub") {
                        getPackType = "subPack";
                        templateObject.recordpackType.set(getPackType);
                    } else if (valueData[j].items[0].sku == "vs1_essentials_sub") {
                        getPackType = "subPack";
                        templateObject.recordpackType.set(getPackType);
                    } else if (valueData[j].items[0].sku == "vs1_plus_sub") {
                        getPackType = "subPack";
                        templateObject.recordpackType.set(getPackType);
                    }
                }
            }
        }
    });

    let isFxCurrencyLicence = Session.get('CloudUseForeignLicence');
    let isSeedToSaleLicence = Session.get('CloudSeedToSaleLicence');
    let isManufacturingLicence = Session.get('CloudManufacturingLicence');
    let isWMSLicence = Session.get('CloudWMSLicence');
    let isAddExtraUserLicence = Session.get('CloudAddExtraLicence');
    let isMatrixLicence = Session.get('CloudMatrixLicence');
    let isShippingLicence = Session.get('CloudShippingLicence');
    let isPayrollLicence = Session.get('CloudPayrollLicence');
    let isExpenseClaimsLicence = Session.get('CloudExpenseClaimsLicence');
    let isPOSLicence = Session.get('CloudPOSLicence');
    let regionData = Session.get('ERPLoggedCountry');
    let recordObj = null;
    let essentailPrice = 0;
    let plusPrice = 0;

    let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
    let isGreenTrack = Session.get('isGreenTrack');

    if (isGreenTrack) {
        $('.additionalNotGreenTrack').css('display', 'none');
        $(".simpleStartText").html('VS1 Cloud' + ' ' + '<b class="">$225</b> /MO.');
        $(".essentialsText").html('Quickbooks' + ' ' + '<b class="">$250</b> /MO.');
        $(".plusText").html('Xero' + ' ' + '<b class="">$250</b> /MO.');
        $.get("/GreentrackModules.json").success(function (data) {
            for (let i = 0; i < data.tvs1licenselevelsnmodules.length; i++) {

                if (data.tvs1licenselevelsnmodules[i].Region == regionData) {
                    recordObj = {
                        type: data.tvs1licenselevelsnmodules[i].TYPE,
                        region: data.tvs1licenselevelsnmodules[i].Region,
                        licenselevel: data.tvs1licenselevelsnmodules[i].LicenseLevel,
                        licenseLeveldescprion: data.tvs1licenselevelsnmodules[i].LicenseLevelDescprion,
                        moduleId: data.tvs1licenselevelsnmodules[i].ModuleId,
                        moduleName: data.tvs1licenselevelsnmodules[i].ModuleName,
                        moduledescription: data.tvs1licenselevelsnmodules[i].moduledescription,
                        isExtra: data.tvs1licenselevelsnmodules[i].IsExtra,
                        discountfrom: data.tvs1licenselevelsnmodules[i].Discountfrom,
                        discountto: data.tvs1licenselevelsnmodules[i].Discountto,
                        pricenocurrency: data.tvs1licenselevelsnmodules[i].Price || 0,
                        price: utilityService.modifynegativeCurrencyFormat(data.tvs1licenselevelsnmodules[i].Price) || 0,
                        discount: data.tvs1licenselevelsnmodules[i].discount,
                    };

                    if (data.tvs1licenselevelsnmodules[i].ModuleName != "" && data.tvs1licenselevelsnmodules[i].IsExtra == true) {
                        extraArr.push(recordObj);
                    }
                    if (data.tvs1licenselevelsnmodules[i].LicenseLevelDescprion == "VS1Cloud") {
                        if (data.tvs1licenselevelsnmodules[i].ModuleName != "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            simplestartArr.push(recordObj);
                        }

                    } else if (data.tvs1licenselevelsnmodules[i].LicenseLevelDescprion == "Quick Books") {
                        if (data.tvs1licenselevelsnmodules[i].ModuleName != "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            essentailsArr.push(recordObj);
                        }

                        if (data.tvs1licenselevelsnmodules[i].ModuleName == "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            essentailPrice = utilityService.modifynegativeCurrencyFormat(data.tvs1licenselevelsnmodules[i].Price) || 0;
                        }

                    } else if (data.tvs1licenselevelsnmodules[i].LicenseLevelDescprion == "Xero") {
                        if (data.tvs1licenselevelsnmodules[i].ModuleName != "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            plusArr.push(recordObj);
                        }

                        if (data.tvs1licenselevelsnmodules[i].ModuleName == "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            plusPrice = utilityService.modifynegativeCurrencyFormat(data.tvs1licenselevelsnmodules[i].Price) || 0;
                        }

                    }
                }
            };

            // $(".essentailAmt").html(essentailPrice);
            // $(".plusAmt").html(plusPrice);
            templateObject.simplestartArr.set(simplestartArr);
            templateObject.essentailsArr.set(essentailsArr);
            templateObject.plusArr.set(plusArr);

            var result = [];
            $.each(extraArr, function (i, e) {
                var matchingItems = $.grep(result, function (item) {
                    return item.moduleName === e.moduleName;
                });
                if (matchingItems.length === 0) {
                    result.push(e);
                }
            });
            templateObject.extraArr.set(result);
            setTimeout(function () {
                $('.essentialsdiv .custom-control-input').prop("checked", false);
                $('.plusdiv .custom-control-input').prop("checked", false);
                // if(cloudPackage === "Simple Start"){
                //   //$('.simplediv #SimpleStart').prop( "checked", false );
                // }else if(cloudPackage === "Essentials"){
                //   $('.essentialsdiv .custom-control-input').prop( "checked", true);
                //   $('.plusdiv .custom-control-input').prop( "checked", false );
                // }else if(cloudPackage === "PLUS"){
                //   $('.essentialsdiv .custom-control-input').prop( "checked", true );
                //   $('.plusdiv .custom-control-input').prop( "checked", true );
                // }
                // $('.fullScreenSpin').css('display','none');
            }, 500);

        });
    } else {
        //$.get("VS1Modules.json").success(function(data){
        $.get("MasterVS1Pricing.json").success(function (data) {
            for (let i = 0; i < data.tvs1licenselevelsnmodules.length; i++) {

                if (data.tvs1licenselevelsnmodules[i].Region == regionData) {
                    let tvs1ModulePrice = data.tvs1licenselevelsnmodules[i].Price || 0;
                    if (data.tvs1licenselevelsnmodules[i].ModuleName == "Add Extra User") {
                        if (isPurchasedTrueERPModule == 'true') {
                            tvs1ModulePrice = data.tvs1licenselevelsnmodules[i].isPurchasedTrueERPPrice || 0;
                        }
                    }
                    recordObj = {
                        type: data.tvs1licenselevelsnmodules[i].TYPE,
                        region: data.tvs1licenselevelsnmodules[i].Region,
                        licenselevel: data.tvs1licenselevelsnmodules[i].LicenseLevel,
                        licenseLeveldescprion: data.tvs1licenselevelsnmodules[i].LicenseLevelDescprion,
                        moduleId: data.tvs1licenselevelsnmodules[i].ModuleId,
                        moduleName: data.tvs1licenselevelsnmodules[i].ModuleName,
                        moduledescription: data.tvs1licenselevelsnmodules[i].moduledescription,
                        isExtra: data.tvs1licenselevelsnmodules[i].IsExtra,
                        discountfrom: data.tvs1licenselevelsnmodules[i].Discountfrom,
                        discountto: data.tvs1licenselevelsnmodules[i].Discountto,
                        pricenocurrency: tvs1ModulePrice || 0,
                        price: utilityService.modifynegativeCurrencyFormat(tvs1ModulePrice) || 0,
                        discount: data.tvs1licenselevelsnmodules[i].discount,
                    };

                    if (data.tvs1licenselevelsnmodules[i].ModuleName != "" && data.tvs1licenselevelsnmodules[i].IsExtra == true && data.tvs1licenselevelsnmodules[i].IsMonthly == false) {
                        extraArr.push(recordObj);
                    }
                    if ((data.tvs1licenselevelsnmodules[i].ModuleName != "") && (data.tvs1licenselevelsnmodules[i].IsExtra == true) && (data.tvs1licenselevelsnmodules[i].IsMonthly == true)) {
                        monthArr.push(recordObj);
                    }

                    if (data.tvs1licenselevelsnmodules[i].LicenseLevelDescprion == "Simple Start") {
                        if (data.tvs1licenselevelsnmodules[i].ModuleName != "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            simplestartArr.push(recordObj);
                        }

                    } else if (data.tvs1licenselevelsnmodules[i].LicenseLevelDescprion == "Essentials") {
                        if (data.tvs1licenselevelsnmodules[i].ModuleName != "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            essentailsArr.push(recordObj);
                        }

                        if (data.tvs1licenselevelsnmodules[i].ModuleName == "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            essentailPrice = utilityService.modifynegativeCurrencyFormat(data.tvs1licenselevelsnmodules[i].Price) || 0;
                        }

                    } else if (data.tvs1licenselevelsnmodules[i].LicenseLevelDescprion == "PLUS") {
                        if (data.tvs1licenselevelsnmodules[i].ModuleName != "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            plusArr.push(recordObj);
                        }

                        if (data.tvs1licenselevelsnmodules[i].ModuleName == "" && data.tvs1licenselevelsnmodules[i].IsExtra == false) {
                            plusPrice = utilityService.modifynegativeCurrencyFormat(data.tvs1licenselevelsnmodules[i].Price) || 0;
                        }

                    }
                }
            };

            $(".essentailAmt").html(essentailPrice);
            $(".plusAmt").html(plusPrice);

            $(".essentialsTextVal").html(essentailPrice.replace(/[^0-9.-]+/g, ""));
            $(".plusTextVal").html(plusPrice.replace(/[^0-9.-]+/g, ""));

            templateObject.simplestartArr.set(simplestartArr);
            templateObject.essentailsArr.set(essentailsArr);
            templateObject.plusArr.set(plusArr);

            var result = [];
            $.each(extraArr, function (i, e) {
                var matchingItems = $.grep(result, function (item) {
                    return item.moduleName === e.moduleName;
                });
                if (matchingItems.length === 0) {
                    result.push(e);
                }
            });
            templateObject.extraArr.set(result);
            var monthResult = [];
            $.each(monthArr, function (i, e) {
                var matchingItemsMonth = $.grep(monthResult, function (itemMonth) {
                    return itemMonth.moduleName === e.moduleName;
                });
                if (matchingItemsMonth.length === 0) {
                    monthResult.push(e);
                }
            });
            templateObject.monthArr.set(monthResult);
            setTimeout(function () {
                /*
                if(isFxCurrencyLicence == true){
                $('#formCheck-Additional13').prop( "checked", true);
                }
                if(isSeedToSaleLicence == true){
                $('#formCheck-Additional29').prop( "checked", true);
                }
                if(isManufacturingLicence == true){
                $('#formCheck-Additional30').prop( "checked", true);
                }
                if(isWMSLicence == true){
                $('#formCheck-Additional31').prop( "checked", true);
                }
                if(isAddExtraUserLicence == true){
                $('#formCheck-Additional12').prop( "checked", true);
                }
                if(isMatrixLicence == true){
                $('#formCheck-Additional32').prop( "checked", true);
                }
                if(isShippingLicence == true){
                $('#formCheck-Additional23').prop( "checked", true);
                }
                if(isPayrollLicence == true){
                $('#formCheck-Additional24').prop( "checked", true);
                }
                if(isExpenseClaimsLicence == true){
                $('#formCheck-Additional15').prop( "checked", true);
                }
                if(isPOSLicence == true){
                $('#formCheck-Additional14').prop( "checked", true);
                }

                 */

                if (cloudPackage === "Simple Start") {
                    //$('.simplediv #SimpleStart').prop( "checked", false );
                } else if (cloudPackage === "Essentials") {
                    $('.essentialsdiv .custom-control-input').prop("checked", true);
                    $('.plusdiv .custom-control-input').prop("checked", false);
                } else if (cloudPackage === "PLUS") {
                    $('.essentialsdiv .custom-control-input').prop("checked", true);
                    $('.plusdiv .custom-control-input').prop("checked", true);
                }
                // $('.fullScreenSpin').css('display','none');
            }, 500);

        });

        setTimeout(function () {
            if (cloudPackage === "Simple Start") {
                //$('.simplediv #SimpleStart').prop( "checked", false );
            } else if (cloudPackage === "Essentials") {
                $('.essentialsdiv .custom-control-input').prop("checked", true);
                $('.plusdiv .custom-control-input').prop("checked", false);
            } else if (cloudPackage === "PLUS") {
                $('.essentialsdiv .custom-control-input').prop("checked", true);
                $('.plusdiv .custom-control-input').prop("checked", true);
            }
            // $('.fullScreenSpin').css('display','none');
        }, 1000);
    }

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 1024px)")

        function mediaQuery(x) {
            if (x.matches) {
                $("#settingsCard1").removeClass("col-3");
                $("#settingsCard1").addClass("col-6");
                $("#settingsCard2").removeClass("col-3");
                $("#settingsCard2").addClass("col-6");
                $("#settingsCard3").removeClass("col-3");
                $("#settingsCard3").addClass("col-6");
                $("#settingsCard4").removeClass("col-3");
                $("#settingsCard4").addClass("col-6");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 250);

    setTimeout(function () {

        var x = window.matchMedia("(max-width: 420px)")

        function mediaQuery(x) {
            if (x.matches) {
                $("#settingsCard1").removeClass("col-3");
                $("#settingsCard1").addClass("col-12");
                $("#settingsCard2").removeClass("col-3");
                $("#settingsCard2").addClass("col-12");
                $("#settingsCard3").removeClass("col-3");
                $("#settingsCard3").addClass("col-12");
                $("#settingsCard4").removeClass("col-3");
                $("#settingsCard4").addClass("col-12");

            }
        }
        mediaQuery(x)
        x.addListener(mediaQuery)
    }, 250);

});
Template.companyappsettingsdup.events({
    'click #refreshpagelist': function (event) {
        $('.fullScreenSpin').css('display', 'inline-block');
        Meteor._reload.reload();
    },
    'click .btnRefresh': function () {
        Meteor._reload.reload();
    },
    'click .essentialsdiv .chkSettings': function (event) {
        // Meteor._reload.reload();
        if ($(event.target).is(':checked')) {
            $(event.target).val(1);
            $('#upgradeModal').modal('toggle');
        } else {
            $(event.target).val(6);
        }
    },
    'click .plusdiv .chkSettings': function (event) {
        // Meteor._reload.reload();
        if ($(event.target).is(':checked')) {
            $(event.target).val(1);
            $('#upgradeModalPlus').modal('toggle');
        } else {
            $(event.target).val(6);
        }
    },
    'click .chkSettings.chkInventory': function (event) {
        // Meteor._reload.reload();
        if ($(event.target).is(':checked')) {
            //swal('Info', 'Please note if Inventory Tracking is turned on it cannot be turned off for a product in the future.', 'info');
            swal('PLEASE NOTE', 'If Inventory tracking is turned on it cannot be disabled in the future.', 'info');
        } else {
            //$(event.target).val(6);
        }
    },
    'click .btnBack': function (event) {
        event.preventDefault();
        history.back(1);
    },
    'click .btnAddVS1User': function (event) {
        //FlowRouter.go('/employeescard');
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
    'click #formCheck-Essentials': function (event) {
        if ($(event.target).is(':checked')) {
            $('.essentialsdiv .custom-control-input').prop("checked", true);
        } else {
            $('.essentialsdiv .custom-control-input').prop("checked", false);
        }
    },
    'click #formCheck-Plus': function (event) {
        if ($(event.target).is(':checked')) {
            $('.plusdiv .custom-control-input').prop("checked", true);
        } else {
            $('.plusdiv .custom-control-input').prop("checked", false);
        }
    },
    'click .accordion2': function (event) {
        // this.classList.toggle("active2");
        var targetID = $(event.target).closest('tr').attr('id');
        // var panel= $(event.target).closest('div.panel2').attr('id');
        // $(event.target).closest("div").find(".panel2").text();
        var panel = 'panel2-' + targetID;

        var x = document.getElementById(panel);
        if (x.style.display === "none") {
            $(event.target).addClass('active2');
            x.style.display = "block";
        } else {
            x.style.display = "none";
            $(event.target).removeClass('active2');
        }
    },
    'click .btnTopGlobalSave': function () {
        $('.fullScreenSpin').css('display', 'inline-block');
        const templateObject = Template.instance();
        let checkLinkTrueERP = false;
        let cloudPackageCheck = localStorage.getItem('vs1cloudlicenselevel');
        var checkEssentials = document.getElementById("formCheck-Essentials");
        var checkPlus = document.getElementById("formCheck-Plus");
        let paymentAmount = 0;
        let accessLevel = 0;
        let accessLevelCheck = 1;
        var totalAdditions = 0;
        let grandTotal = 0;
        let lineItemsForm = [];
        let lineItemsForm1 = [];
        let lineItemObjForm = {};
        let userQuantity = 1;
        let sumPriceUser = 0;
        var splashLineArray = new Array();
        let getCurrenUserPack = templateObject.recordpackType.get();
        if ((checkEssentials.checked == true) && (checkPlus.checked == false)) {
            if (cloudPackageCheck == "Essentials") {
                paymentAmount = 0;
                accessLevelCheck = 2;
            } else {
                if (getCurrenUserPack == "trialPack") {
                    paymentAmount = 50;
                } else if (getCurrenUserPack == "subPack") {
                    paymentAmount = 32.5;
                } else {
                    paymentAmount = 32.5;
                }

                lineItemObjForm = {
                    ModuleName: "Essentials" || '',
                    Price: paymentAmount.toFixed(2),
                    DiscountedPrice: paymentAmount.toFixed(2),
                    RenewPrice: paymentAmount.toFixed(2),
                    RenewDiscountedPrice: paymentAmount.toFixed(2),
                    RenewDiscountDesc: 1

                };
                lineItemsForm1.push(lineItemObjForm);
            }

            accessLevel = 2;
        } else if ((checkPlus.checked == true)) {
            if (cloudPackageCheck == "PLUS") {
                paymentAmount = 0;
                accessLevelCheck = 3;
            } else if (cloudPackageCheck == "Essentials") {
                if (getCurrenUserPack == "trialPack") {
                    paymentAmount = 75;
                } else if (getCurrenUserPack == "subPack") {
                    paymentAmount = 50;
                } else {
                    paymentAmount = 50;
                }
                lineItemObjForm = {
                    ModuleName: "PLUS" || '',
                    Price: paymentAmount.toFixed(2),
                    DiscountedPrice: paymentAmount.toFixed(2),
                    RenewPrice: paymentAmount.toFixed(2),
                    RenewDiscountedPrice: paymentAmount.toFixed(2),
                    RenewDiscountDesc: 1

                };
                lineItemsForm1.push(lineItemObjForm);
            }
            //paymentAmount = 25;
        } else if (cloudPackageCheck == "Simple Start") {
            if (getCurrenUserPack == "trialPack") {
                paymentAmount = 75;
            } else if (getCurrenUserPack == "subPack") {
                paymentAmount = 57.5;
            } else {
                paymentAmount = 57.5;
            }
            lineItemObjForm = {
                ModuleName: "Simple Start" || '',
                Price: paymentAmount.toFixed(2),
                DiscountedPrice: paymentAmount.toFixed(2),
                RenewPrice: paymentAmount.toFixed(2),
                RenewDiscountedPrice: paymentAmount.toFixed(2),
                RenewDiscountDesc: 1

            };
            lineItemsForm1.push(lineItemObjForm);
            //paymentAmount = 50;

        }
        accessLevel = 3;

        $('.additionalModule:checkbox:checked').each(function () {
            userQuantity = $(this).attr('additionalqty');
            sumPriceUser = parseFloat($(this).val()) * parseInt(userQuantity);

            totalAdditions += isNaN(parseFloat(sumPriceUser)) ? 0 : parseFloat(sumPriceUser);
            var mytext = $(this).next('label').text();
            if (mytext === "Link To TrueERP" || mytext === "Connect to Live ERP DB") {
                lineItemObjForm = {
                    ModuleName: 'Link To TrueERP' || '',
                    Price: sumPriceUser,
                    DiscountedPrice: sumPriceUser,
                    RenewPrice: sumPriceUser,
                    RenewDiscountedPrice: sumPriceUser,
                    RenewDiscountDesc: userQuantity

                };
                checkLinkTrueERP = true;
            } else {
                lineItemObjForm = {
                    ModuleName: mytext || '',
                    Price: sumPriceUser,
                    DiscountedPrice: sumPriceUser,
                    RenewPrice: sumPriceUser,
                    RenewDiscountedPrice: sumPriceUser,
                    RenewDiscountDesc: userQuantity

                };
            }

            lineItemsForm.push(lineItemObjForm);

        });

        grandTotal = paymentAmount + totalAdditions;

        var erpGet = erpDb();
        let objDetailsUser = "";
        if (accessLevel === accessLevelCheck) {
            objDetailsUser = {
                Name: "VS1_AddModules",
                Params: {
                    CloudUserName: erpGet.ERPUsername,
                    CloudPassword: erpGet.ERPPassword,
                    Paymentamount: parseFloat(grandTotal),
                    PayMethod: "Cash",
                    Price: parseFloat(paymentAmount),
                    DiscountedPrice: parseFloat(paymentAmount),
                    DiscountDesc: "",
                    RenewPrice: parseFloat(paymentAmount),
                    RenewDiscountedPrice: parseFloat(paymentAmount),
                    RenewDiscountDesc: "",
                    // LicenseLevel:parseInt(accessLevel) ||0,
                    ExtraModules: lineItemsForm,
                    ERPUserName: "VS1_Cloud_Admin",
                    ERPPassword: "DptfGw83mFl1j&9"
                }
            };
        } else {
            objDetailsUser = {
                Name: "VS1_AddModules",
                Params: {
                    CloudUserName: erpGet.ERPUsername,
                    CloudPassword: erpGet.ERPPassword,
                    Paymentamount: parseFloat(grandTotal),
                    PayMethod: "Cash",
                    LicenseLevel: parseInt(accessLevel) || 0,
                    Price: parseFloat(paymentAmount),
                    DiscountedPrice: parseFloat(paymentAmount),
                    DiscountDesc: "",
                    RenewPrice: parseFloat(paymentAmount),
                    RenewDiscountedPrice: parseFloat(paymentAmount),
                    RenewDiscountDesc: "",
                    ExtraModules: lineItemsForm,
                    ERPUserName: "VS1_Cloud_Admin",
                    ERPPassword: "DptfGw83mFl1j&9"
                }
            };
        }
        let currencyname = (CountryAbbr).toLowerCase();
        let stringQuery = "?";
        let name = Session.get('mySessionEmployee').split(' ')[0];
        let surname = Session.get('mySessionEmployee').split(' ')[1];

        if (lineItemsForm.length > 0) {
            for (let i = 0; i < lineItemsForm.length; i++) {
                lineItemObjForm = {
                    ModuleName: lineItemsForm[i].ModuleName || '',
                    Price: lineItemsForm[i].Price.toFixed(2),
                    DiscountedPrice: lineItemsForm[i].DiscountedPrice.toFixed(2),
                    RenewPrice: lineItemsForm[i].RenewPrice.toFixed(2),
                    RenewDiscountedPrice: lineItemsForm[i].RenewDiscountedPrice,
                    RenewDiscountDesc: lineItemsForm[i].RenewDiscountDesc

                };
                lineItemsForm1[i] = lineItemObjForm;
            }
        }

        for (let l = 0; l < lineItemsForm1.length; l++) {
            stringQuery = stringQuery + "product" + l + "=" + lineItemsForm1[l].ModuleName + "&price" + l + "=" + Currency + lineItemsForm1[l].Price + "&qty" + l + "=" + lineItemsForm1[l].RenewDiscountDesc + "&";
        }
        stringQuery = stringQuery + "tax=0" + "&total=" + Currency + grandTotal + "&customer=" + Session.get('vs1companyName') + "&name=" + name + "&surname=" + surname + "&company=" + Session.get('vs1companyName') + "&customeremail=" + localStorage.getItem('mySession') + "&type=VS1 Modules Purchase&url=" + window.location.href + "&server=" + erpGet.ERPIPAddress + "&username=" + erpGet.ERPUsername + "&token=" + erpGet.ERPPassword + "&session=" + erpGet.ERPDatabase + "&port=" + erpGet.ERPPort + "&currency=" + currencyname;
        newStripePrice = grandTotal.toFixed(2);
        var oPost = new XMLHttpRequest();
        oPost.open("POST", URLRequest + loggedserverIP + ':' + loggedserverPort + '/' + 'erpapi/VS1_Cloud_Task/Method?Name="VS1_AddModules"', true);
        oPost.setRequestHeader("database", vs1loggedDatatbase);
        oPost.setRequestHeader("username", 'VS1_Cloud_Admin');
        oPost.setRequestHeader("password", 'DptfGw83mFl1j&9');
        oPost.setRequestHeader("Accept", "application/json");
        oPost.setRequestHeader("Accept", "application/html");
        oPost.setRequestHeader("Content-type", "application/json");

        var myString = '"JsonIn"' + ':' + JSON.stringify(objDetailsUser);
        oPost.send(myString);
        let newStripePrice = grandTotal.toFixed(2);
        oPost.onreadystatechange = function () {
            if (oPost.readyState == 4 && oPost.status == 200) {
                //Meteor.call('braintreeChargeCard', Session.get('VS1AdminUserName'), parseFloat(grandTotal));
                // Meteor.call('StripeChargeCard', Session.get('VS1AdminUserName'), newStripePrice.replace('.', ''), function(error, result){
                //     if(error){

                //     }else{

                //     }
                // });
                if (newStripePrice > 0) {

                    let to2Decimal = objDetailsUser.Params.Price.toFixed(2)
                        let amount = to2Decimal.toString().replace(/\./g, '')

                        let getLasTDatabase = erpGet.ERPDatabase;
                    if (getLasTDatabase) {
                        deleteStoreDatabase(getLasTDatabase).then(function (data) {
                            $.ajax({
                                url: stripeGlobalURL + 'vs1_module_purchase.php',
                                data: {
                                    'email': Session.get('VS1AdminUserName'),
                                    'price': newStripePrice.replace('.', ''),
                                    'currency': currencyname
                                },
                                method: 'post',
                                success: function (response) {
                                    let response2 = JSON.parse(response);
                                    if (response2 != null) {
                                        $.ajax({
                                            url: stripeGlobalURL + 'update.php',
                                            data: {
                                                'email': Session.get('VS1AdminUserName'),
                                                'products': JSON.stringify(lineItemsForm1),
                                                'price': newStripePrice.replace('.', ''),
                                                'update_price': newStripePrice,
                                                'currency': currencyname,
                                                'country': Session.get('ERPLoggedCountry')
                                            },
                                            method: 'post',
                                            success: function (responseFinal) {
                                                $('.fullScreenSpin').css('display', 'none');
                                                if (responseFinal == "success") {
                                                    swal({
                                                        title: 'Payment Successful',
                                                        text: "Please log out to activate your changes.",
                                                        type: 'success',
                                                        showCancelButton: false,
                                                        confirmButtonText: 'OK'
                                                    }).then((result) => {
                                                        //if (result.value) {
                                                        window.open('/', '_self');
                                                        //} else if (result.dismiss === 'cancel') {

                                                        //}
                                                    });
                                                } else {
                                                      swal({
                                                        title: 'Payment Successful',
                                                        text: "Please log out to activate your changes.",
                                                        type: 'success',
                                                        showCancelButton: false,
                                                        confirmButtonText: 'OK'
                                                    }).then((result) => {
                                                        //if (result.value) {
                                                        window.open('/', '_self');
                                                        //} else if (result.dismiss === 'cancel') {

                                                        //}
                                                    });
                                                }
                                            }
                                        });
                                        // swal({
                                        //     title: 'Payment Successful',
                                        //     text: "Please log out to activate your changes.",
                                        //     type: 'success',
                                        //     showCancelButton: false,
                                        //     confirmButtonText: 'OK'
                                        // }).then((result) => {
                                        //     //if (result.value) {
                                        //     window.open('/', '_self');
                                        //     //} else if (result.dismiss === 'cancel') {

                                        //     //}
                                        // });
                                    } else {
                                        window.open(stripeGlobalURL + stringQuery, '_self');
                                    }
                                }
                            });
                        }).catch(function (err) {
                            window.open(stripeGlobalURL + stringQuery, '_self');
                        });
                    } else {
                        $.ajax({
                            url: stripeGlobalURL + 'vs1_module_purchase.php',
                            data: {
                                'email': Session.get('VS1AdminUserName'),
                                'price': newStripePrice.replace('.', ''),
                                'currency': currencyname
                            },
                            method: 'post',
                            success: function (response) {
                                $('.fullScreenSpin').css('display', 'none');
                                let response1 = JSON.parse(response);
                                if (response1 != null) {
                                    swal({
                                        title: 'Payment Successful',
                                        text: "Please log out to activate your changes.",
                                        type: 'success',
                                        showCancelButton: false,
                                        confirmButtonText: 'OK'
                                    }).then((result) => {
                                        //if (result.value) {
                                        window.open('/', '_self');
                                        //} else if (result.dismiss === 'cancel') {

                                        //}
                                    });
                                } else {
                                    window.open(stripeGlobalURL + stringQuery, '_self');
                                }
                            }
                        });
                    }
                } else {

                    $('.fullScreenSpin').css('display', 'none');
                    var myArrResponse = JSON.parse(oPost.responseText);
                    if (myArrResponse.ProcessLog.ResponseStatus != "OK") {
                        if (myArrResponse.ProcessLog.ResponseStatus == "Database is initialialised with Seed To Sale Defaults") {
                            swal({
                                title: 'License Successfully Changed',
                                text: "Please log out to activate your changes.",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    let getLasTDatabase = erpGet.ERPDatabase;
                                    if (getLasTDatabase) {
                                        deleteStoreDatabase(getLasTDatabase).then(function (data) {
                                            window.open('/', '_self');
                                        }).catch(function (err) {
                                            window.open('/', '_self');
                                        });
                                    } else {
                                        window.open('/', '_self');
                                    }

                                } else if (result.dismiss === 'cancel') {}
                            });
                        } else {
                            swal('Oooops...', myArrResponse.ProcessLog.ResponseStatus || 'Oooops...', 'error');
                        }
                    } else {
                        if (checkLinkTrueERP == true) {
                            swal({
                                title: 'Module Successfully Added',
                                text: "Please Click TrueERP Connection to Add ERP Details.",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                //if (result.value) {
                                Session.setPersistent('CloudTrueERPModule', true);
                                window.open('/linktrueerp', '_self');
                                //} else if (result.dismiss === 'cancel') {

                                //}
                            });
                        } else {
                            swal({
                                title: 'License Successfully Changed',
                                text: "Please log out to activate your changes.",
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.value) {
                                    let getLasTDatabase = erpGet.ERPDatabase;
                                    if (getLasTDatabase) {
                                        deleteStoreDatabase(getLasTDatabase).then(function (data) {
                                            window.open('/', '_self');
                                        }).catch(function (err) {
                                            window.open('/', '_self');
                                        });
                                    } else {
                                        window.open('/', '_self');
                                    }
                                } else if (result.dismiss === 'cancel') {}
                            });
                        }

                        // swal('Licence Successfully Changed', '', 'success');
                    }
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

            } else if (oPost.readyState == 4 && oPost.status == 401) {
                $('.fullScreenSpin').css('display', 'none');
                var ErrorResponse = oPost.getResponseHeader('errormessage');
                if (ErrorResponse.indexOf("Could not connect to ERP") >= 0) {
                    swal({
                        title: 'Oooops...',
                        text: "Could not connect to Database. Unable to start Database. Licence on hold ",
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'Try Again'
                    }).then((result) => {
                        if (result.value) {
                            Meteor._reload.reload();
                        } else if (result.dismiss === 'cancel') {}
                    });
                } else {
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
                }
            } else if (oPost.readyState == '') {
                $('.fullScreenSpin').css('display', 'none');

                swal('Connection Failed', oPost.getResponseHeader('errormessage') + ' Please try again!', 'error');
            }
        }
    },
    'click .additionalModule': function (event) {
        //  var totalAdditions = 0;
        //  $('.additionalModule:checkbox:checked').each(function(){
        //      totalAdditions += isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val());
        // });
        //
        //   $("#sumAdditionalAmount").val(Math.round(totalAdditions));
        let cloudPackageCheck = localStorage.getItem('vs1cloudlicenselevel');
        if ($(event.target).is(':checked')) {
            var myModuleText = $(event.target).next('label').text();
            var myModalId = $(event.target).closest('tr').attr('id');
            if ((myModuleText == "ADP Payroll Integration")) {
                swal({
                    title: 'Price per Connection',
                    text: "Please click OK to enable.",
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    showLoaderOnConfirm: true
                }).then((inputValue) => {
                    if (inputValue.value) {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                    } else {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $('#formCheck-' + myModalId + '').prop("checked", false);
                    }
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $(".vs1Modules").offset().top
                    }, 2000);
                    $('.btnTopGlobalSave').addClass('btnSaveAlert');
                });
            } else if ((myModuleText == "Link To TrueERP")) {
                swal({
                    title: 'Price per Connection',
                    text: "Please click OK to enable.",
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    showLoaderOnConfirm: true
                }).then((inputValue) => {
                    if (inputValue.value) {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(".vs1Modules").offset().top
                        }, 2000);
                        $('.btnTopGlobalSave').addClass('btnSaveAlert');
                    } else {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $('#formCheck-' + myModalId + '').prop("checked", false);
                    }
                });
            } else if ((myModuleText == "Paychex Payroll Integration")) {
                swal({
                    title: 'Price per Connection',
                    text: "Please click OK to enable.",
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    showLoaderOnConfirm: true
                }).then((inputValue) => {
                    if (inputValue.value) {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(".vs1Modules").offset().top
                        }, 2000);
                        $('.btnTopGlobalSave').addClass('btnSaveAlert');
                    } else {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $('#formCheck-' + myModalId + '').prop("checked", false);
                    }
                });
            } else if ((myModuleText == "Website Integration")) {
                swal({
                    title: 'Price per Connection',
                    text: "Please click OK to enable.",
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    showLoaderOnConfirm: true
                }).then((inputValue) => {
                    if (inputValue.value) {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(".vs1Modules").offset().top
                        }, 2000);
                        $('.btnTopGlobalSave').addClass('btnSaveAlert');
                    } else {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $('#formCheck-' + myModalId + '').prop("checked", false);
                    }
                });
            } else if ((myModuleText == "ADP Payroll Integration")) {
                swal({
                    title: 'Price per Connection',
                    text: "Please click OK to enable.",
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    showLoaderOnConfirm: true
                }).then((inputValue) => {
                    if (inputValue.value) {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(".vs1Modules").offset().top
                        }, 2000);
                        $('.btnTopGlobalSave').addClass('btnSaveAlert');
                    } else {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $('#formCheck-' + myModalId + '').prop("checked", false);
                    }
                });
            } else if ((myModuleText == "Use Foreign Currency")) {
                if (cloudPackageCheck == "PLUS") {
                    swal({
                        title: 'You already have Foreign Currency enabled for your package Activate in “Settings: VS1 Modules.”',
                        text: '',
                        type: 'info',
                        showCancelButton: false,
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.value) {
                            // $('#formCheck-'+myModalId+'').attr('additionalqty',0);
                            $('#formCheck-' + myModalId + '').prop("checked", false);
                            $([document.documentElement, document.body]).animate({
                                scrollTop: $(".vs1Modules").offset().top
                            }, 2000);
                            $('.btnTopGlobalSave').addClass('btnSaveAlert');
                        } else if (result.dismiss === 'cancel') {
                            // $('#formCheck-'+myModalId+'').attr('additionalqty',0);
                            $('#formCheck-' + myModalId + '').prop("checked", false);
                        }
                    });
                } else {
                    swal({
                        title: 'Price per User',
                        text: "How many users would you like to enable for this feature ?",
                        input: 'number',
                        inputValue: 1,
                        inputAttributes: {
                            min: 1,
                            id: 'edtUserQty',
                            name: 'edtUserQty'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        showLoaderOnConfirm: true
                    }).then((inputValue) => {
                        if (inputValue.value) {
                            $('#formCheck-' + myModalId + '').attr('additionalqty', inputValue.value);
                            $([document.documentElement, document.body]).animate({
                                scrollTop: $(".vs1Modules").offset().top
                            }, 2000);
                            $('.btnTopGlobalSave').addClass('btnSaveAlert');
                        } else {
                            $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                            $('#formCheck-' + myModalId + '').prop("checked", false);
                        }
                    });
                }
            } else if (myModuleText == "Payroll Integration") {
                if ($('#formCheck-Essentials').is(':checked') || $('#formCheck-Plus').is(':checked')) {}
                else {
                    swal({
                        title: 'Oooops...',
                        text: '' + myModuleText + ' is not available as an add on for your current package. An upgrade to the Essential package will be added to your selection.',
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel'
                        // cancelButtonClass: "btn-default"
                    }).then((result) => {
                        if (result.value) {
                            $('.essentialsdiv .custom-control-input').prop("checked", true);
                            $([document.documentElement, document.body]).animate({
                                scrollTop: $(".vs1Modules").offset().top
                            }, 2000);
                            $('.btnTopGlobalSave').addClass('btnSaveAlert');
                        } else if (result.dismiss === 'cancel') {
                            $('.essentialsdiv .custom-control-input').prop("checked", false);
                            $(event.target).prop("checked", false);
                        }
                    });

                }
            } else if ((myModuleText == "Shipping")) {
                if ($('#formCheck-Essentials').is(':checked') || $('#formCheck-Plus').is(':checked')) {
                    swal({
                        title: 'Price per User',
                        text: "How many users would you like to enable for this feature ?",
                        input: 'number',
                        inputValue: 1,
                        inputAttributes: {
                            min: 1,
                            id: 'edtUserQty',
                            name: 'edtUserQty'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        showLoaderOnConfirm: true
                    }).then((inputValue) => {
                        if (inputValue.value) {
                            $('#formCheck-' + myModalId + '').attr('additionalqty', inputValue.value);
                            $([document.documentElement, document.body]).animate({
                                scrollTop: $(".vs1Modules").offset().top
                            }, 2000);
                            $('.btnTopGlobalSave').addClass('btnSaveAlert');
                        } else {
                            $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                            $('#formCheck-' + myModalId + '').prop("checked", false);
                        }
                    });
                } else {
                    swal({
                        title: 'Oooops...',
                        text: '' + myModuleText + ' is not available as an add on for your current package. An upgrade to the Essential package will be added to your selection.',
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel'
                        // cancelButtonClass: "btn-default"
                    }).then((result) => {
                        if (result.value) {
                            $('.essentialsdiv .custom-control-input').prop("checked", true);
                            swal({
                                title: 'Price per User',
                                text: "How many users would you like to enable for this feature ?",
                                input: 'number',
                                inputValue: 1,
                                inputAttributes: {
                                    min: 1,
                                    id: 'edtUserQty',
                                    name: 'edtUserQty'
                                },
                                showCancelButton: true,
                                confirmButtonText: 'OK',
                                showLoaderOnConfirm: true
                            }).then((inputValue) => {
                                if (inputValue.value) {
                                    $('#formCheck-' + myModalId + '').attr('additionalqty', inputValue.value);
                                    $([document.documentElement, document.body]).animate({
                                        scrollTop: $(".vs1Modules").offset().top
                                    }, 2000);
                                    $('.btnTopGlobalSave').addClass('btnSaveAlert');
                                } else {
                                    $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                                    $('#formCheck-' + myModalId + '').prop("checked", false);
                                }
                            });
                        } else if (result.dismiss === 'cancel') {
                            $('.essentialsdiv .custom-control-input').prop("checked", false);
                            $(event.target).prop("checked", false);
                        }
                    });

                }
            } else if ((myModuleText == "Seed To Sale") || (myModuleText == "Manufacturing")
                 || (myModuleText == "WMS") || (myModuleText == "Matrix")) {
                if ($('#formCheck-Plus').is(':checked')) {
                    swal({
                        title: 'Price per User',
                        text: "How many users would you like to enable for this feature ?",
                        input: 'number',
                        inputValue: 1,
                        inputAttributes: {
                            min: 1,
                            id: 'edtUserQty',
                            name: 'edtUserQty'
                        },
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        showLoaderOnConfirm: true
                    }).then((inputValue) => {
                        if (inputValue.value) {
                            $('#formCheck-' + myModalId + '').attr('additionalqty', inputValue.value);
                            $([document.documentElement, document.body]).animate({
                                scrollTop: $(".vs1Modules").offset().top
                            }, 2000);
                            $('.btnTopGlobalSave').addClass('btnSaveAlert');
                        } else {
                            $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                            $('#formCheck-' + myModalId + '').prop("checked", false);
                        }
                    });
                } else {
                    swal({
                        title: 'Oooops...',
                        text: '' + myModuleText + ' is not available as an add on for your current package. An upgrade to the PLUS package will be added to your selection.',
                        type: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel'
                        // cancelButtonClass: "btn-default"
                    }).then((result) => {
                        if (result.value) {
                            $('.plusdiv .custom-control-input').prop("checked", true);
                            swal({
                                title: 'Price per User',
                                text: "How many users would you like to enable for this feature ?",
                                input: 'number',
                                inputValue: 1,
                                inputAttributes: {
                                    min: 1,
                                    id: 'edtUserQty',
                                    name: 'edtUserQty'
                                },
                                showCancelButton: true,
                                confirmButtonText: 'OK',
                                showLoaderOnConfirm: true
                            }).then((inputValue) => {
                                if (inputValue.value) {
                                    $('#formCheck-' + myModalId + '').attr('additionalqty', inputValue.value);
                                } else {
                                    $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                                    $('#formCheck-' + myModalId + '').prop("checked", false);
                                }
                            });
                        } else if (result.dismiss === 'cancel') {
                            $('.plusdiv .custom-control-input').prop("checked", false);
                            $(event.target).prop("checked", false);
                        }
                    });

                }
            } else {
                swal({
                    title: 'Price per User',
                    text: "How many users would you like to enable for this feature ?",
                    input: 'number',
                    inputValue: 1,
                    inputAttributes: {
                        min: 1,
                        id: 'edtUserQty',
                        name: 'edtUserQty'
                    },
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    showLoaderOnConfirm: true
                }).then((inputValue) => {
                    if (inputValue.value) {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', inputValue.value);
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(".vs1Modules").offset().top
                        }, 2000);
                        $('.btnTopGlobalSave').addClass('btnSaveAlert');
                    } else {
                        $('#formCheck-' + myModalId + '').attr('additionalqty', 1);
                        $('#formCheck-' + myModalId + '').prop("checked", false);
                    }
                });
            }

        }

    },
    'click .addEssentialModule': function (event) {
        let cloudPackageCheck = localStorage.getItem('vs1cloudlicenselevel');
        if ($(event.target).is(':checked')) {
            var myModuleText = $(event.target).next('label').text();
            var myModalId = $(event.target).closest('tr').attr('id');
            if ((cloudPackageCheck != "Essentials") && (cloudPackageCheck != "PLUS")) {
                swal({
                    title: 'Oooops...',
                    text: '' + myModuleText + ' is not available as an add on for your current package. An upgrade to the Essential package will be added to your selection.',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel'
                    // cancelButtonClass: "btn-default"
                }).then((result) => {
                    if (result.value) {
                        $('.essentialsdiv .custom-control-input').prop("checked", true);
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(".vs1Modules").offset().top
                        }, 2000);
                        $('.btnTopGlobalSave').addClass('btnSaveAlert');
                    } else if (result.dismiss === 'cancel') {
                        $('.essentialsdiv .custom-control-input').prop("checked", false);
                        $(event.target).prop("checked", false);
                    }
                });
            }

        }
    },
    'click .addPlusModule': function (event) {
        let cloudPackageCheck = localStorage.getItem('vs1cloudlicenselevel');
        if ($(event.target).is(':checked')) {
            var myModuleText = $(event.target).next('label').text();
            var myModalId = $(event.target).closest('tr').attr('id');
            if ((cloudPackageCheck != "PLUS")) {
                swal({
                    title: 'Oooops...',
                    text: '' + myModuleText + ' is not available as an add on for your current package. An upgrade to the PLUS package will be added to your selection.',
                    type: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel'
                    // cancelButtonClass: "btn-default"
                }).then((result) => {
                    if (result.value) {
                        $('.plusdiv .custom-control-input').prop("checked", true);
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $(".vs1Modules").offset().top
                        }, 2000);
                        $('.btnTopGlobalSave').addClass('btnSaveAlert');
                    } else if (result.dismiss === 'cancel') {
                        $('.plusdiv .custom-control-input').prop("checked", false);
                        $(event.target).prop("checked", false);
                    }
                });
            }

        }
    }

});

Template.registerHelper('equals', function (a, b) {
    return a === b;
});
Template.registerHelper('notEquals', function (a, b) {
    return a != b;
});
Template.companyappsettingsdup.helpers({
    packagetype: () => {
        let cloudPackage = localStorage.getItem('vs1cloudlicenselevel');
        return cloudPackage;
    },
    simplestartArr: () => {
        return Template.instance().simplestartArr.get();
    },
    essentailsArr: () => {
        return Template.instance().essentailsArr.get();
    },
    plusArr: () => {
        return Template.instance().plusArr.get();
    },
    extraArr: () => {
        return Template.instance().extraArr.get().sort(function (a, b) {
            if (a.moduleName == 'NA') {
                return 1;
            } else if (b.moduleName == 'NA') {
                return -1;
            }
            return (a.moduleName.toUpperCase() > b.moduleName.toUpperCase()) ? 1 : -1;
        });
    },
    monthArr: () => {
        return Template.instance().monthArr.get().sort(function (a, b) {
            if (a.moduleName == 'NA') {
                return 1;
            } else if (b.moduleName == 'NA') {
                return -1;
            }
            return (a.moduleName.toUpperCase() > b.moduleName.toUpperCase()) ? 1 : -1;
        });
    },
    isGreenTrack: function () {
        let checkGreenTrack = Session.get('isGreenTrack') || false;
        return checkGreenTrack;
    }
});
