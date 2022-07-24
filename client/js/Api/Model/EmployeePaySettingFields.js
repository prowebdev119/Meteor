import EmployeeModel from "./Employee";
/**
 * @type {{Employee: EmployeeModel}}
 */
 export default class EmployeePaySettingFields {
  constructor({
    Abn,
    DateLastActuallyPaid,
    Employee,
    Employeeid,
    Employeepaynotes,
    FirstPayDate,
    GlobalRef,
    ID,
    IsContractedOut,
    IsDirector,
    ISEmpty,
    IsMarriedWoman,
    Isontheroster,
    KeyStringFieldName,
    KeyValue,
    LastPaid,
    MsTimeStamp,
    MsUpdateSiteCode,
    NICTableLetter,
    NonWageIncome,
    Payperiod,
    PayPeriodInDays,
    Recno,
    STPJobkeeperFinishDateDesc,
    STPJobkeeperFinishFN,
    STPJobkeeperFinishFNDesc,
    STPJobkeeperStartDateDesc,
    STPJobkeeperStartFN,
    STPJobkeeperStartFNDesc,
    STPTier,
    STPTierDesc,
    Uknino,
    Uktaxcode,
  }) {
    this.Abn = Abn;
    this.DateLastActuallyPaid = DateLastActuallyPaid;
    if (Employee instanceof EmployeeModel) {
      this.Employee = Employee;
    } else {
      this.Employee = new EmployeeModel(Employee);
    }
    this.Employeeid = Employeeid;
    this.Employeepaynotes = Employeepaynotes;
    this.FirstPayDate = FirstPayDate;
    this.GlobalRef = GlobalRef;
    this.ID = ID;
    this.IsContractedOut = IsContractedOut;
    this.IsDirector = IsDirector;
    this.ISEmpty = ISEmpty;
    this.IsMarriedWoman = IsMarriedWoman;
    this.Isontheroster = Isontheroster;
    this.KeyStringFieldName = KeyStringFieldName;
    this.KeyValue = KeyValue;
    this.LastPaid = LastPaid;
    this.MsTimeStamp = MsTimeStamp;
    this.MsUpdateSiteCode = MsUpdateSiteCode;
    this.NICTableLetter = NICTableLetter;
    this.NonWageIncome = NonWageIncome;
    this.Payperiod = Payperiod;
    this.PayPeriodInDays = PayPeriodInDays;
    this.Recno = Recno;
    this.STPJobkeeperFinishDateDesc = STPJobkeeperFinishDateDesc;
    this.STPJobkeeperFinishFN = STPJobkeeperFinishFN;
    this.STPJobkeeperFinishFNDesc = STPJobkeeperFinishFNDesc;
    this.STPJobkeeperStartDateDesc = STPJobkeeperStartDateDesc;
    this.STPJobkeeperStartFN = STPJobkeeperStartFN;
    this.STPJobkeeperStartFNDesc = STPJobkeeperStartFNDesc;
    this.STPTier = STPTier;
    this.STPTierDesc = STPTierDesc;
    this.Uknino = Uknino;
    this.Uktaxcode = Uktaxcode;
  }
}
