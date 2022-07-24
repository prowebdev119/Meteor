Template.addnewdepartment.events({
  'click #create-NewDepartment':function(event){
    let deptName = $('#deptName').val();
    let deptDesc = $('#deptDescription').val();
    let siteCode = $('#siteCode').val();


    let objDetails = {
    type:"TDeptClass",
    fields:
    {
    Active:true,
    DeptClassName: deptName,
    Description:deptDesc,
    SiteCode:siteCode
    }
    };


    let erpGet = erpDb();
    let oPost = new XMLHttpRequest();

    oPost.open("POST",URLRequest + erpGet.ERPIPAddress + ':' + erpGet.ERPPort+ '/' +erpGet.ERPApi+ '/' +erpGet.ERPDeptClass, true);
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
     let deptID = dataReturn.fields.ID;
     let deptName = $('#deptName').val();
//let deptName = $('#deptName').val();
     if(deptID){
       Bert.alert('<strong>SUCCESS:</strong>  New Department successfully created!', 'success');
       location.reload();
       //const deptrecords = [];
       let templateObject = Template.instance();
       templateObject.defaultDepartment.set(deptName);
       /*
       let deptrecordObj = {
         department: deptName || ' ',
       };
       deptrecords.push(deptrecordObj);
       templateObject.deptrecords.set(deptrecords);
*/
       //templateObject.deptrecords.set(deptName);
       //location.reload();
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

      Bert.alert('<strong>'+ oPost.getResponseHeader('errormessage')+'</strong>. Please close the Department Information in ERP!', 'danger');
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
  }
});
