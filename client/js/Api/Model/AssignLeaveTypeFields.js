export default class AssignLeaveTypeFields {
    constructor({
        LeaveType,
        EmployeeID,
        LeaveCalcMethod,
        HoursAccruedAnnually,
        HoursAccruedAnnuallyFullTimeEmp,
        HoursFullTimeEmpFortnightlyPay,
        HoursLeave,
        OpeningBalance,
        OnTerminationUnusedBalance,
        EFTLeaveType,
        SuperannuationGuarantee
    }){
        this.LeaveType = LeaveType;
        this.EmployeeID = EmployeeID;
        this.LeaveCalcMethod = LeaveCalcMethod;
        this.HoursAccruedAnnually = HoursAccruedAnnually;
        this.HoursAccruedAnnuallyFullTimeEmp = HoursAccruedAnnuallyFullTimeEmp;
        this.HoursFullTimeEmpFortnightlyPay = HoursFullTimeEmpFortnightlyPay;
        this.HoursLeave = HoursLeave;
        this.OpeningBalance = OpeningBalance;
        this.OnTerminationUnusedBalance = OnTerminationUnusedBalance;
        this.EFTLeaveType = EFTLeaveType;
        this.SuperannuationGuarantee = SuperannuationGuarantee;
    }
}
  
  