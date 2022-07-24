
Template.addnewtaxrate.events({

    'change .taxRate':function() {
        let taxRateAmount = parseFloat($('#taxRate').val());
        $('#taxtotalPerc').text(taxRateAmount.toFixed(2) + '%');
    },

    'change .upd_taxRate':function() {
        let taxRateAmount = parseFloat($('#upd_taxRate').val());
        $('#upd_taxtotalPerc').text(taxRateAmount.toFixed(2) + '%');
    },

    'click #create-NewTaxCode':function(event) {
        let taxName = $('#taxName').val();
        let taxDesc = $('#taxDescription').val();
        let taxRate = parseFloat($('#taxRate').val() / 100);
        let taxType= $('.select-tax-type-input').val();
        let objDetails = {
        type:"TTaxcode",
        fields:
        {
            Active:true,
            CodeName: taxName,
            Description:taxDesc,
            KeyValue:taxType,
            Rate:taxRate,

        }
        };


        let erpGet = erpDb();
        let oPost = new XMLHttpRequest();

        oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort+ '/' +erpGet.ERPApi+ '/' +erpGet.ERPTaxCodeData, true);
        oPost.setRequestHeader("database",erpGet.ERPDatabase);
        oPost.setRequestHeader("username",erpGet.ERPUsername);
        oPost.setRequestHeader("password",erpGet.ERPPassword);
        oPost.setRequestHeader("Accept", "application/json");
        oPost.setRequestHeader("Accept", "application/html");
        oPost.setRequestHeader("Content-type", "application/json");

        let myString = JSON.stringify(objDetails);

        oPost.send(myString);
        oPost.timeout = 30000;
        oPost.onreadystatechange = function() {


        if (oPost.readyState == 4 && oPost.status == 200) {
          let dataReturn = JSON.parse(oPost.responseText);
         let taxCodeID = dataReturn.fields.ID;

         if(taxCodeID){
           Bert.alert('<strong>SUCCESS:</strong>  Tax Code  successfully created!', 'success');
           location.reload();
           //window.open('/billcard?id='+billID,'_self');
          // FlowRouter.go('/billslist');
         }


        } else if(oPost.readyState == 4 && oPost.status == 403){
        


        swal({
  title: 'Oooops...',
  text: oPost.getResponseHeader('errormessage'),
  type: 'error',
  showCancelButton: false,
  confirmButtonText: 'Try Again'
  }).then((result) => {
  if (result.value) {
    Meteor._reload.reload();
  } else if (result.dismiss === 'cancel') {

  }
});
        }else if(oPost.readyState == 4 && oPost.status == 406){
        //oPost.setRequestHeader("Access-Control-Expose-Headers", "Content-Type");

          //oPost.setRequestHeader("Content-Length", "1");
          let ErrorResponse = oPost.getResponseHeader('errormessage');
          let segError = ErrorResponse.split(':');
          
        if((segError[1]) == ' "Unable to lock object'){
          
          Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>. Please close the Tax Code Information in ERP!', 'danger');
        }else{
          swal({
  title: 'Oooops...',
  text: oPost.getResponseHeader('errormessage'),
  type: 'error',
  showCancelButton: false,
  confirmButtonText: 'Try Again'
  }).then((result) => {
  if (result.value) {
    Meteor._reload.reload();
  } else if (result.dismiss === 'cancel') {

  }
});
        }

        }

        AddUERP(oPost.responseText);
        }

        event.preventDefault();
    },
    'click #add-component':function(){
        let tempInstance = Template.instance();
        let id = parseInt((tempInstance.$('.taxComponents').last()[0].id).split('tax-component-')[1]);
        id++;
        let element = '<div class="taxComponents" id="tax-component-'+ id +'"><input type="text" id="taxDescription" name="taxDescription" placeholder="GST">' +
            '<input type="text" placeholder="0" id="taxRate" name="taxRate" class="taxRate"><span>%</span> <span id="delete-component-'+ id +'" class="delete-component">x</span></div>';
        tempInstance.$('.taxComponents').last().after(element);
        if(tempInstance.$('#close-button-0').hasClass('close-button')){
            tempInstance.$('#close-button-0').removeClass('close-button');
        }
    },
    'click .delete-component':function(event){
        let tempInstance = Template.instance();
        let elementToBeRemoved = event.currentTarget.id.split('delete-component-')[1];
        tempInstance.$('#tax-component-' + elementToBeRemoved).remove();
        if(tempInstance.$('.taxComponents').length === 1){
            tempInstance.$('#close-button-0').addClass('close-button');
        }
    },
    'click .taxRateValues': function (event) {
        $(".select-tax-type-input").val(event.currentTarget.innerText);
    }
});
