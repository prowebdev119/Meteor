export default class LeaveRequestFields {
    constructor({
        EmployeeID,
        TypeofRequest,
        Description,
        StartDate,
        EndDate,
        PayPeriod,
        Hours,
        Status
    }){
        this.EmployeeID = EmployeeID;
        this.TypeofRequest = TypeofRequest;
        this.Description = Description;
        this.StartDate = StartDate;
        this.EndDate = EndDate;
        this.PayPeriod = PayPeriod;
        this.Hours = Hours;
        this.Status = Status;
    }
}
  
  