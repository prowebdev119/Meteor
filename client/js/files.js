import {EmployeeProfileService} from './profile-service';
import { ReactiveVar } from 'meteor/reactive-var';
import { CoreService } from '../js/core-service';
Template.files.onRendered(function(){
var employeeProfileService = new EmployeeProfileService();
getEmployeeProfiles();
function getEmployeeProfiles () {
employeeProfileService.getEmployeeProfile().then((dataListRet)=>{

    for (var event in dataListRet) {
    var dataCopy = dataListRet[event];
    for (var data in dataCopy) {
    var mainData = dataCopy[data];
    var customerEmail = mainData.Email;
    if(customerEmail != ''){
      document.getElementById("useremail").innerHTML = '<a href="mailto:'+ customerEmail +'">'+ customerEmail +'</a>';
    }else{
      document.getElementById("useremail").innerHTML = '<a href="/settings/user"> + Add email address</a>';
    }
    }
    }
  });
}
});
