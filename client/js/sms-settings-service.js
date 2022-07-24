import {BaseService} from '../js/base-service.js';
export class SMSService extends BaseService {

    getSMSSettings(){
        let options = {
            PropertyList: "PrefName,Fieldvalue",
            select: '[PrefName]="VS1SMSID" or [PrefName]="VS1SMSToken" or [PrefName]="VS1SMSPhone" or [PrefName]="VS1SAVESMSMSG" or [PrefName]="VS1STARTSMSMSG" or [PrefName]="VS1STOPSMSMSG"'
         }
         return this.getList(this.ERPObjects.TERPPreference, options);
    }

    saveSMSSettings(data){
        return this.POST(this.ERPObjects.TERPPreference, data);
    }

}
