import {BaseService} from '../js/base-service.js';
export class AppointmentService extends BaseService {

    saveAppointment(data){
        return this.POST(this.ERPObjects.TAppointment, data);
    }

    saveTimeLog(data){
        return this.POST(this.ERPObjects.TAppointmentsTimeLog, data);
    }


    saveAppointmentPreferences(data){
        return this.POST(this.ERPObjects.TAppointmentPreferences, data);
    }

    appointmentCreateInv(data){
        return this.POST('VS1_Cloud_Task/Method?Name="VS1_InvoiceAppt"', data);
    }


     repeatAppointment(data){
        return this.POST('VS1_Cloud_Task/Method?Name="VS1_RepeatAppointment"', data);
    }

    getAllRepeatAppointments(){
        let options = {
            ListType: "Detail"
         }
         return this.getList(this.ERPObjects.VS1_RepeatAppointment, options);
    }

     getCalendarsettings(){
        let options = {
            PropertyList: "ID,EmployeeID,ShowApptDurationin,ShowSaturdayinApptCalendar,ShowSundayinApptCalendar,ApptStartTime,ApptEndtime,DefaultApptDuration,DefaultServiceProductID,DefaultServiceProduct",
         }
        return this.getList(this.ERPObjects.TAppointmentPreferences, options);
    }

    getEmployeeCalendarSettings(data){
        let options = {
            PropertyList: "ID,EmployeeID,ShowApptDurationin,ShowSaturdayinApptCalendar,ShowSundayinApptCalendar,ApptStartTime,ApptEndtime,DefaultApptDuration,DefaultServiceProductID,DefaultServiceProduct",
            select: "[EmployeeID]="+data
         }
        return this.getList(this.ERPObjects.TAppointmentPreferences, options);
    }



   getGlobalSettings(){
         let options = {
            PropertyList: "PrefName,Fieldvalue",
            select: '[PrefName]="DefaultServiceProduct" or [PrefName]="DefaultServiceProductID" or [PrefName]="DefaultApptDuration" or [PrefName]="ApptStartTime" or [PrefName]="ApptEndtime" or [PrefName]="ShowSaturdayinApptCalendar" or [PrefName]="ShowSundayinApptCalendar" or [PrefName]="ShowApptDurationin" or [PrefName]="RoundApptDurationTo" or [PrefName]="MinimumChargeAppointmentTime"'
         }
        return this.getList(this.ERPObjects.TERPPreference,options);
    }


    getGlobalSettingsExtra(){
         let options = {
            PropertyList: "ID,Prefname,fieldValue",
         }
     return this.getList(this.ERPObjects.TERPPreferenceExtra,options);
    }

    getAllAppointmentList(){
    let options = '';
      options = {
         ListType: "Detail",
         select: "[Active]=true"
     };
    //}

      return this.getList(this.ERPObjects.TAppointment, options);
    }

    getAllAppointmentListCount(){
        let options = {
            PropertyList: "ID"
        };
        return this.getList(this.ERPObjects.TAppointment, options);
    }

}
