import {
    TaxRateService
} from "../settings-service";
import {
    ReactiveVar
} from 'meteor/reactive-var';
import {
    SideBarService
} from '../../js/sidebar-service';
import '../../lib/global/indexdbstorage.js';
let sideBarService = new SideBarService();
Template.taxratelistpop.onCreated(function() {

});

Template.taxratelistpop.onRendered(function() {

});

Template.taxratelistpop.events({
  'click .btnRefreshTax': function (event) {
      let templateObject = Template.instance();
      $('.fullScreenSpin').css('display', 'inline-block');
      const customerList = [];
      const clientList = [];
      let salesOrderTable;
      var splashArray = new Array();
      var splashArrayTaxRateList = new Array();
      const dataTableList = [];
      const tableHeaderList = [];
      let sideBarService = new SideBarService();
      let taxRateService = new TaxRateService();
      let dataSearchName = $('#tblTaxRate_filter input').val();
      var currentLoc = FlowRouter.current().route.path;
      if (dataSearchName.replace(/\s/g, '') != '') {
          sideBarService.getTaxRateVS1ByName(dataSearchName).then(function (data) {
              let lineItems = [];
              let lineItemObj = {};
              if (data.ttaxcodevs1.length > 0) {
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                    var dataList = [
                        data.ttaxcodevs1[i].Id || '',
                        data.ttaxcodevs1[i].CodeName || '',
                        data.ttaxcodevs1[i].Description || '-',
                        taxRate || 0,
                    ];

                    let taxcoderecordObj = {
                        codename: data.ttaxcodevs1[i].CodeName || ' ',
                        coderate: taxRate || ' ',
                    };

                    // taxCodesList.push(taxcoderecordObj);

                    splashArrayTaxRateList.push(dataList);
                }

                  var datatable = $('#tblTaxRate').DataTable();
                  datatable.clear();
                  datatable.rows.add(splashArrayTaxRateList);
                  datatable.draw(false);

                  $('.fullScreenSpin').css('display', 'none');
              } else {

                  $('.fullScreenSpin').css('display', 'none');
                   $('#taxRateListModal').modal('toggle');
                  swal({
                      title: 'Question',
                      text: "Tax Code does not exist, would you like to create it?",
                      type: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Yes',
                      cancelButtonText: 'No'
                  }).then((result) => {
                      if (result.value) {
                          $('#newTaxRateModal').modal('toggle');
                          $('#edtTaxNamePop').val(dataSearchName);
                      } else if (result.dismiss === 'cancel') {
                          $('#newTaxRateModal').modal('toggle');
                      }
                  });

              }

          }).catch(function (err) {
              $('.fullScreenSpin').css('display', 'none');
          });
      } else {
        sideBarService.getTaxRateVS1().then(function(data) {

                let records = [];
                let inventoryData = [];
                for (let i = 0; i < data.ttaxcodevs1.length; i++) {
                    let taxRate = (data.ttaxcodevs1[i].Rate * 100).toFixed(2);
                    var dataList = [
                        data.ttaxcodevs1[i].Id || '',
                        data.ttaxcodevs1[i].CodeName || '',
                        data.ttaxcodevs1[i].Description || '-',
                        taxRate || 0,
                    ];

                    let taxcoderecordObj = {
                        codename: data.ttaxcodevs1[i].CodeName || ' ',
                        coderate: taxRate || ' ',
                    };

                    // taxCodesList.push(taxcoderecordObj);

                    splashArrayTaxRateList.push(dataList);
                }
      var datatable = $('#tblTaxRate').DataTable();
            datatable.clear();
            datatable.rows.add(splashArrayTaxRateList);
            datatable.draw(false);

            $('.fullScreenSpin').css('display', 'none');
            }).catch(function (err) {
              $('.fullScreenSpin').css('display', 'none');
          });
      }
  },
  'keyup #tblTaxRate_filter input': function (event) {
    if (event.keyCode == 13) {
       $(".btnRefreshTax").trigger("click");
    }
  }
});

Template.taxratelistpop.helpers({

});

Template.registerHelper('equals', function(a, b) {
    return a === b;
});
