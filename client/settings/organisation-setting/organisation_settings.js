import {OrganisationService} from '../../js/organisation-service';
import {CountryService} from '../../js/country-service';
import {ReactiveVar} from 'meteor/reactive-var';
import { SideBarService } from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
let organisationService = new OrganisationService();

Template.organisationsettings.onCreated(() => {
    const templateObject = Template.instance();
    templateObject.showSkype = new ReactiveVar();
    templateObject.showMob = new ReactiveVar();
    templateObject.showFax = new ReactiveVar();
    templateObject.showLinkedIn = new ReactiveVar();
    templateObject.countryList = new ReactiveVar([]);
    templateObject.showPoAddress = new ReactiveVar();
    templateObject.phCity = new ReactiveVar();
    templateObject.samePhysicalAddress1 = new ReactiveVar();
    templateObject.samePhysicalAddress2 = new ReactiveVar();
    templateObject.samePhysicalAddress3 = new ReactiveVar();
    templateObject.phState = new ReactiveVar();
    templateObject.phCountry = new ReactiveVar();
    templateObject.phCode = new ReactiveVar();
    templateObject.phAttention = new ReactiveVar();
    templateObject.countryData = new ReactiveVar();
    templateObject.hideCreateField = new ReactiveVar();
    templateObject.paAddress1 = new ReactiveVar();
    templateObject.paAddress2 = new ReactiveVar();
    templateObject.paAddress3 = new ReactiveVar();
    templateObject.phAddress1 = new ReactiveVar();
    templateObject.phAddress2 = new ReactiveVar();
    templateObject.phAddress3 = new ReactiveVar();
    templateObject.fieldLength = new ReactiveVar();
    templateObject.completePoAddress = new ReactiveVar();
    templateObject.completePhAddress = new ReactiveVar();
    templateObject.imageFileData=new ReactiveVar();

    templateObject.isSameAddress = new ReactiveVar();
    templateObject.isSameAddress.set(false);

    templateObject.iscompanyemail = new ReactiveVar();
    templateObject.iscompanyemail.set(false);
});

Template.organisationsettings.onRendered(function () {
  $('.fullScreenSpin').css('display','inline-block');
    const templateObject = Template.instance();
    let showPoAddress = false;
    let countries = [];
    let organizations = ['Club or Society', 'Company', 'Individual', 'Not for Profit', 'Partnership', 'Self Managed Superannuation Fund', 'Sole Trader', 'Superannuation Fund', 'Trust'];
    var countryService = new CountryService();
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

    templateObject.getCompLogoData = function () {
        organisationService.getCompLogo().then((data) => {
            for (let i = 0; i < data.tcomplogo.length; i++) {
                //countries.push(data.tcomplogo[i].Country)
            }
            countries = _.sortBy(countries);
            templateObject.countryData.set(countries);
        });
    };
    // templateObject.getCompLogoData();

    templateObject.getDropDown = function (id, country) {
        $("#" + id).autocomplete({
            source: country,
            minLength: 0
        }).focus(function () {
            $(this).autocomplete('search', "")
        });
        $("#" + id).autocomplete( "widget" ).addClass( "countries-dropdown" );
    };
    getOrganisationDetails();

    function getOrganisationDetails() {
        organisationService.getOrganisationDetail().then((dataListRet) => {
            for (let event in dataListRet) {
                let dataCopy = dataListRet[event];
                for (let data in dataCopy) {
                    let mainData = dataCopy[data];
                    templateObject.showSkype.set(mainData.ContactEmail);
                    templateObject.showMob.set(mainData.MobileNumber);
                    templateObject.showFax.set(mainData.FaxNumber);
                    templateObject.showLinkedIn.set(mainData.DvaABN);
                    templateObject.phCity.set(mainData.PoCity);
                    templateObject.phState.set(mainData.PoState);
                    templateObject.phCountry.set(mainData.PoCountry);
                    templateObject.phCode.set(mainData.PoPostcode);
                    templateObject.phAttention.set(mainData.Contact);
                    let companyName = mainData.CompanyName;
                    let postalAddress = mainData.PoBox + '\n' + mainData.PoBox2 + '\n' + mainData.PoBox3;
                    let physicalAddress = mainData.Address + '\n' + mainData.Address2 + '\n' + mainData.Address3;
                    templateObject.samePhysicalAddress1.set(mainData.Address);
                    templateObject.samePhysicalAddress2.set(mainData.Address2);
                    templateObject.samePhysicalAddress3.set(mainData.Address3);

                    $('#displayname').val(mainData.CompanyName);
                    $('#tradingname').val(mainData.TradingName);

                    $('#ownerfirstname').val(mainData.Firstname);
                    $('#ownerlastname').val(mainData.LastName);
                    //$('#businessnumber').val(mainData.Abn);
                    //$('#branch').val(mainData.Apcano);
                    //$('#comment').val(mainData.GlobalRef);
                    // $('#org_type').val(mainData.CompanyCategory);
                    $('#edtCompanyNumber').val(mainData.CompanyNumber);
                    $('#edtABNNumber').val(mainData.abn);
                    $('#edtAddress').val(mainData.Address);
                    $('#edtCity').val(mainData.City);
                    $('#edtState').val(mainData.State);
                    $('#edtPostCode').val(mainData.Postcode);
                    $('#edtCountry').val(mainData.Country);
                    $('#edtCountry').append('<option selected="selected" value="'+mainData.Country+'">'+mainData.Country+'</option>');
                    $('#edtpostaladdress').val(mainData.PoBox);
                    $('#edtPostalCity').val(mainData.PoCity);
                    $('#edtPostalState').val(mainData.PoState);
                    $('#edtPostalPostCode').val(mainData.PoPostcode);
                    $('#edtPostalCountry').val(mainData.PoCountry);
                    $('#edtPostalCountry').append('<option selected="selected" value="'+mainData.PoCountry+'">'+mainData.PoCountry+'</option>');

          if((mainData.Address == mainData.PoBox) && (mainData.City == mainData.PoCity)
          && (mainData.State == mainData.PoState)&& (mainData.Postcode == mainData.PoPostcode)
          && (mainData.Country == mainData.PoCountry)){
                templateObject.isSameAddress.set(true);
                $('#chksameaddress').attr("checked","checked");
                $('#show_address_data').css("display","none");
          }else{
            $('#chksameaddress').removeAttr("checked");
            $('#show_address_data').css("display","block");
          }
            if(mainData.TrackEmails){
              templateObject.iscompanyemail.set(true);
              $('#chkIsDefailtEmail').attr("checked","checked");
            }else{
              //templateObject.iscompanyemail.set(false);
              $('#chkIsDefailtEmail').removeAttr("checked");
            }

                    $('#pocontact').val(mainData.Contact);
                    $('#contact').val(mainData.ContactName);
                    $('#edtphonenumber').val(mainData.PhoneNumber);
                    $('#edtemailaddress').val(mainData.Email);
                    $('#edtWebsite').val(mainData.Url);
                    //$('#mobile').val(mainData.MobileNumber);
                    $('#edtfaxnumber').val(mainData.FaxNumber);

                }
            }
            $('.fullScreenSpin').css('display','none');
        }).catch(function (err) {
          $('.fullScreenSpin').css('display','none');
          });

    }

    let imageData= (localStorage.getItem("Image"));
    if(imageData)
    {
        $('#uploadedImage').attr('src', imageData);
        $('#uploadedImage').attr('width','50%');
        $('#removeLogo').show();
        $('#changeLogo').show();
    }

});

Template.organisationsettings.helpers({
    showMob: () => {
        return Template.instance().showMob.get();
    },
    showSkype: () => {
        return Template.instance().showSkype.get();
    },
    showFax: () => {
        return Template.instance().showFax.get();
    },
    showLinkedIn: () => {
        return Template.instance().showLinkedIn.get();
    },
    countryList: () => {
        return Template.instance().countryData.get();
    },
    showPoAddress: () => {
        return Template.instance().showPoAddress.get();
    },
    hideCreateField: () => {
        return Template.instance().hideCreateField.get();
    },
    fieldLength: () => {
        return Template.instance().fieldLength.get();
    },
    isSameAddress: () => {
    return Template.instance().isSameAddress.get();
    },
    iscompanyemail: () => {
    return Template.instance().iscompanyemail.get();
    },
    checkCountryABN: () => {
      let countryABNValue = "ABN";
      if(LoggedCountry== "South Africa"){
        countryABNValue = "VAT";
      }
    return countryABNValue;
    }
});
Template.organisationsettings.events({

    'click #mobField': function (event) {
        $('#ul_o li:hidden').slice(0, 1);
        var Length = $('#ul_o li:visible').length;
        let templateObject = Template.instance();
        templateObject.fieldLength.set(Length);
        document.getElementById('open_mob').style.display = 'inline-block';
        document.getElementById('exitMob').style.display = 'inline-block';
        document.getElementById('mobField').style.display = 'none';
    },
    'click #chkIsDefailtEmail': function(event){
      let templateObj = Template.instance();
        if($(event.target).is(':checked')){
          
            templateObj.iscompanyemail.set(true);
        }else{
          //alert("not checked");
          templateObj.iscompanyemail.set(false);
        }
    },
    'click #exitMob': function (event) {
        let templateObject = Template.instance();
        let length = templateObject.fieldLength.get();
        templateObject.fieldLength.set(length + 1);
        document.getElementById('open_mob').style.display = 'none';
        document.getElementById('exitMob').style.display = 'none';
        document.getElementById('mobField').style.display = 'inline-block';
    },
    'click #skypeId': function (event) {
        $('#ul_o li:hidden').slice(0, 1);
        var Length = $('#ul_o li:visible').length;
        let templateObject = Template.instance();
        templateObject.fieldLength.set(Length);
        document.getElementById('skypeId').style.display = 'none';
        document.getElementById('open_skype').style.display = 'inline-block';
        document.getElementById('exitSkype').style.display = 'inline-block';
    },
    'click #exitSkype': function (event) {
        let templateObject = Template.instance();
        let length = templateObject.fieldLength.get();
        templateObject.fieldLength.set(length + 1);
        document.getElementById('open_skype').style.display = 'none';
        document.getElementById('exitSkype').style.display = 'none';
        document.getElementById('skypeId').style.display = 'inline-block';
    },
    'click #faxId': function (event) {
        $('#ul_o li:hidden').slice(0, 1);
        var Length = $('#ul_o li:visible').length;
        let templateObject = Template.instance();
        templateObject.fieldLength.set(Length);
        document.getElementById('faxId').style.display = 'none';
        document.getElementById('open_fax').style.display = 'inline-block';
        document.getElementById('exitFax').style.display = 'inline-block';
    },
    'click #exitFax': function (event) {
        let templateObject = Template.instance();
        let length = templateObject.fieldLength.get();
        templateObject.fieldLength.set(length + 1);
        document.getElementById('faxId').style.display = 'inline-block';
        document.getElementById('open_fax').style.display = 'none';
        document.getElementById('exitFax').style.display = 'none';
    },
    'click #ddiField': function (event) {
        $('#ul_o li:hidden').slice(0, 1);
        var Length = $('#ul_o li:visible').length;
        let templateObject = Template.instance();
        templateObject.fieldLength.set(Length);
        document.getElementById('ddiField').style.display = 'none';
        document.getElementById('open_ddi').style.display = 'inline-block';
        document.getElementById('exitDdi').style.display = 'inline-block';
    },
    'click #exitDdi': function (event) {
        let templateObject = Template.instance();
        let length = templateObject.fieldLength.get();
        templateObject.fieldLength.set(length + 1);
        document.getElementById('ddiField').style.display = 'inline-block';
        document.getElementById('open_ddi').style.display = 'none';
        document.getElementById('exitDdi').style.display = 'none';
    },
    'click #linkedInField': function (event) {
        $('#ul_o li:hidden').slice(0, 1);
        var Length = $('#ul_o li:visible').length;
        let templateObject = Template.instance();
        templateObject.fieldLength.set(Length);
        document.getElementById('linkedInField').style.display = 'none';
        document.getElementById('open_linkedIn').style.display = 'inline-block';
        document.getElementById('exitlinkedIn').style.display = 'inline-block';
    },
    'click #exitlinkedIn': function (event) {
        let templateObject = Template.instance();
        let length = templateObject.fieldLength.get();
        templateObject.fieldLength.set(length + 1);
        document.getElementById('linkedInField').style.display = 'inline-block';
        document.getElementById('open_linkedIn').style.display = 'none';
        document.getElementById('exitlinkedIn').style.display = 'none';
    },
    'click #fbField': function (event) {
        $('#ul_o li:hidden').slice(0, 1);
        var Length = $('#ul_o li:visible').length;
        let templateObject = Template.instance();
        templateObject.fieldLength.set(Length);
        document.getElementById('fbField').style.display = 'none';
        document.getElementById('open_fb').style.display = 'inline-block';
        document.getElementById('exitFb').style.display = 'inline-block';
    },
    'click #exitFb': function (event) {
        let templateObject = Template.instance();
        let length = templateObject.fieldLength.get();
        templateObject.fieldLength.set(length + 1);
        document.getElementById('fbField').style.display = 'inline-block';
        document.getElementById('open_fb').style.display = 'none';
        document.getElementById('exitFb').style.display = 'none';
    },
    'click #googleField': function (event) {
        $('#ul_o li:hidden').slice(0, 1);
        var Length = $('#ul_o li:visible').length;
        let templateObject = Template.instance();
        templateObject.fieldLength.set(Length);
        document.getElementById('googleField').style.display = 'none';
        document.getElementById('open_google').style.display = 'inline-block';
        document.getElementById('exitGplus').style.display = 'inline-block';
    },
    'click #exitGplus': function (event) {
        let templateObject = Template.instance();
        let length = templateObject.fieldLength.get();
        templateObject.fieldLength.set(length + 1);
        document.getElementById('googleField').style.display = 'inline-block';
        document.getElementById('open_google').style.display = 'none';
        document.getElementById('exitGplus').style.display = 'none';
    },
    'click #twitField': function (event) {
        $('#ul_o li:hidden').slice(0, 1);
        var Length = $('#ul_o li:visible').length;
        let templateObject = Template.instance();
        templateObject.fieldLength.set(Length);
        document.getElementById('twitField').style.display = 'none';
        document.getElementById('open_twitter').style.display = 'inline-block';
        document.getElementById('exitTwitter').style.display = 'inline-block';
    },
    'click #exitTwitter': function (event) {
        let templateObject = Template.instance();
        let length = templateObject.fieldLength.get();
        templateObject.fieldLength.set(length + 1);
        document.getElementById('twitField').style.display = 'inline-block';
        document.getElementById('open_twitter').style.display = 'none';
        document.getElementById('exitTwitter').style.display = 'none';
    },
    'click #chksameaddress': function (event) {
        const templateObject = Template.instance();
        //templateObject.showPoAddress.set(!templateObject.showPoAddress.get());
        //let hideAddressData = templateObject.showPoAddress.get();
        if($(event.target).is(':checked')){
            document.getElementById('show_address_data').style.display = 'none';
        }
        else {
            document.getElementById('show_address_data').style.display = 'block';
        }
    },
    'click #saveCompanyInfo': function (event) {
      $('.fullScreenSpin').css('display','inline-block');
        const templateObject = Template.instance();
        let companyID = 1;
        let companyName = $('#displayname').val();
        let tradingName = $('#tradingname').val();

        let ownerFistName = $('#ownerfirstname').val()||'';
        let ownerlastName = $('#ownerlastname').val()||'';
        // let companyCategory = $('#org_type').val();
        let companyABNNumber = $('#edtABNNumber').val();
        let companyNumber = $('#edtCompanyNumber').val();
        let pocontact = $('#pocontact').val();
        let contact = $('#contact').val();
        let phone = $('#edtphonenumber').val();
        let emailAddress = $('#edtemailaddress').val()||localStorage.getItem('VS1AdminUserName');
        let websiteURL = $('#edtWebsite').val();
        let fax = $('#edtfaxnumber').val();

        let shipAddress = $('#edtAddress').val();
        let shipCity = $('#edtCity').val();
        let shipState = $('#edtState').val();
        let shipPostCode = $('#edtPostCode').val();
        let shipCountry = $('#edtCountry').val();

        let poAddress = '';
        let poCity = '';
        let poState = '';
        let poPostCode = '';
        let poCountry = '';
        let isDefaultEmail = false;

        if($('#chksameaddress').is(':checked')){
           poAddress = shipAddress;
           poCity = shipCity;
           poState = shipState;
           poPostCode = shipPostCode;
           poCountry = shipCountry;
        }else{
          poAddress = $('#edtpostaladdress').val();
          poCity = $('#edtPostalCity').val();
          poState = $('#edtPostalState').val();
          poPostCode = $('#edtPostalPostCode').val();
          poCountry = $('#edtPostalCountry').val();
        }

        if($('#chkIsDefailtEmail').is(':checked')){
          isDefaultEmail = true;
        }

        var objDetails = {
            type: "TCompanyInfo",
            fields: {
                Id: companyID,
                CompanyName: companyName,
                TradingName: tradingName,
                Firstname: ownerFistName,
                LastName: ownerlastName,
                // CompanyCategory: companyCategory,
                abn:companyABNNumber,
                CompanyNumber:companyNumber,
                ContactName: contact,
                Contact: pocontact,
                PhoneNumber: phone,
                Email:emailAddress,
                Url: websiteURL,
                FaxNumber:fax,
                Address:shipAddress,
                City:shipCity,
                State:shipState,
                Postcode:shipPostCode,
                Country:shipCountry,
                PoBox:poAddress,
                PoCity:poCity,
                PoState:poState,
                PoPostcode:poPostCode,
                PoCountry:poCountry,
                TrackEmails:isDefaultEmail
            }
        };
        organisationService.saveOrganisationSetting(objDetails).then(function (data){
            // Bert.alert('<strong>'+ 'Organisation details successfully updated!'+'</strong>!', 'success');
            // swal('Organisation details successfully updated!', '', 'success');
            if(isDefaultEmail){
                localStorage.setItem('VS1OrgEmail', emailAddress);
            }else{
              localStorage.setItem('VS1OrgEmail', localStorage.getItem('mySession'));
            }

            swal({
              title: 'Organisation details successfully updated!',
              text: '',
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {
                window.open('/settings','_self');
              } else if (result.dismiss === 'cancel') {

              }});
            $('.fullScreenSpin').css('display','none');
        }).catch(function (err) {
          $('.fullScreenSpin').css('display','none');
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

              }});
        });
    },
    'click .mob-img': function (event) {
        let templateObject = Template.instance();
        let allCountries = templateObject.countryData.get();
        templateObject.getDropDown('open-mobile', allCountries);
        templateObject.$("#open-mobile").trigger("focus");
    },
    'click .phone-img': function (event) {
        let templateObject = Template.instance();
        let allCountries = templateObject.countryData.get();
        templateObject.getDropDown('open-phonenumber', allCountries);
        templateObject.$("#open-phonenumber").trigger("focus");
    },
    'click .country-img': function (event) {
        let templateObject = Template.instance();
        let allCountries = templateObject.countryData.get();
        templateObject.getDropDown('open-country', allCountries);
        templateObject.$("#open-country").trigger("focus");
    },
    'click .pocountry-img': function (event) {
        let templateObject = Template.instance();
        let allCountries = templateObject.countryData.get();
        templateObject.getDropDown('open-pocountry', allCountries);
        templateObject.$("#open-pocountry").trigger("focus");
    },
    'click .fax-img': function (event) {
        let templateObject = Template.instance();
        let allCountries = templateObject.countryData.get();
        templateObject.getDropDown('open-fax', allCountries);
        templateObject.$("#open-fax").trigger("focus");
    },
    'click .ddi-img': function (event) {
        let templateObject = Template.instance();
        let allCountries = templateObject.countryData.get();
        templateObject.getDropDown('open-ddi', allCountries);
        templateObject.$("#open-ddi").trigger("focus");
    },
    'click .orgType-img': function (event) {
        let templateObject = Template.instance();
        let organizations = ['Club or Society', 'Company', 'Individual', 'Not for Profit', 'Partnership', 'Self Managed Superannuation Fund', 'Sole Trader', 'Superannuation Fund', 'Trust'];

        templateObject.getDropDown('org_type', organizations);
        templateObject.$("#org_type").trigger("focus");
    },
    'keyup #postaladdress': function (event) {
        let templateObject = Template.instance();
        var text = document.getElementById('postaladdress').value;
        var lines = text.split('\n');
        var arrArr = text.split('\n');
        let add = '';
        for (let i = 0; i < arrArr.length; i++) {
            if (!arrArr[i]) {
                lines.splice(i, 1);
            }
        }
        templateObject.paAddress1.set(lines[0] ? lines[0]: '');
        templateObject.paAddress2.set(lines[1] ? lines[1]: '');
        if (lines.length > 3) {
            for (let i = 2; i < arrArr.length; i++) {
                add += lines[i] + ' ';
            }
            templateObject.paAddress3.set(add ? add : '');
        }
        else {
            templateObject.paAddress3.set(lines[2] ? lines[2] : '');
        }
    },
    'keyup #physicaladdress': function (event) {
        let templateObject = Template.instance();
        let text = document.getElementById('physicaladdress').value;
        let address = text.split('\n');
        let arrArr = text.split('\n');
        let add = '';
        for (let i = 0; i < arrArr.length; i++) {
            if (!arrArr[i]) {
                address.splice(i, 1);
            }
        }


        templateObject.phAddress1.set(address[0] ? address[0]: '');
        templateObject.phAddress2.set(address[1] ? address[1]: '');
        if (address.length > 3) {
            for (let i = 2; i < arrArr.length; i++) {
                add +=  address[i] + ' ';
            }
            templateObject.phAddress3.set(add ? add : '');
        }
        else {
            templateObject.phAddress3.set(address[2] ? address[2] : '');
        }
    },
    'click #uploadImg':function (event) {
        //let imageData= (localStorage.getItem("Image"));
        let templateObject = Template.instance();
        let imageData=templateObject.imageFileData.get();
        if(imageData!=null && imageData!="")
        {
            localStorage.setItem("Image",imageData);
            $('#uploadedImage').attr('src', imageData);
            $('#uploadedImage').attr('width','50%');
            $('#removeLogo').show();
            $('#changeLogo').show();
        }

    },

    'change #fileInput' :function (event) {
        let templateObject = Template.instance();
        let selectedFile = event.target.files[0];
        let reader = new FileReader();
        $(".Choose_file").text('');
        reader.onload = function(event) {

            $( "#uploadImg" ).prop( "disabled", false );
            $("#uploadImg").addClass("on-upload-logo");
            $(".Choose_file").text(selectedFile.name);
            //$("#uploadImg").css("background-color","yellow");
            templateObject.imageFileData.set(event.target.result);

            //localStorage.setItem("Image",event.target.result);
        };
        reader.readAsDataURL(selectedFile);
    },
    'click #removeLogo':function (event) {
        let templateObject = Template.instance();
        templateObject.imageFileData.set(null);
        localStorage.removeItem("Image");
        // location.reload();
        Meteor._reload.reload();
        //window.open('/organisationsettings','_self');
        //Router.current().render(Template.organisationSettings);
    },
    'click .btnBack':function(event){
      event.preventDefault();
      history.back(1);

      //FlowRouter.go('/settings');
      //window.open('/invoicelist','_self');
    },
    'click .btnUploadFile':function(event){
    // $('#attachment-upload').val('');
    // $('.file-name').text('');
    //$(".btnImport").removeAttr("disabled");
    $('#fileInput').trigger('click');

    },
    'click .btnAddVS1User':function(event){
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
    'click .btnCancelSub': function (event) {
      let loggeduserEmail = localStorage.getItem('mySession');
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
        if (result.value) {

        } else if (result.dismiss === 'cancel') {

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
               window.open('https://depot.vs1cloud.com/vs1subscription/cancelsubscription.php?email='+loggeduserEmail+'&urlfrom='+currentURL.url+'','_self');
              } else if (result.dismiss === 'cancel') {

              }
              });
            }else if (inputValue.value != "") {
              Meteor.call('sendEmail', {
                  from: "VS1 Cloud <info@vs1cloud.com>",
                  to: 'info@vs1cloud.com',
                  subject: loggeduserEmail+': Reason For Cancellation',
                  text: inputValue.value,
                  html:''
              }, function (error, result) {

              });

              swal({
              title: 'Successfully Cancel Your Subscription',
              text: 'Thank you for the Feedback, We will work on solving the issue',
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK'
              }).then((result) => {
              if (result.value) {
               window.open('https://depot.vs1cloud.com/vs1subscription/cancelsubscription.php?email='+loggeduserEmail+'&urlfrom='+currentURL.url+'','_self');
              } else if (result.dismiss === 'cancel') {

              }
              });

            }else{

            }




        });



         }
      });
    }

});
Template.registerHelper('equals', function (a, b) {
    return a === b;
});
