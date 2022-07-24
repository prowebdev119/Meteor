export default class PayTemplateDeductionLineFields {
    constructor({
        ID,
        EmployeeID,
        DeductionType,
        CalculationType,
        ControlAccount,
        Percentage,
        Amount,
    }){
        this.ID = ID;
        this.EmployeeID = EmployeeID;
        this.DeductionType = DeductionType;
        this.CalculationType = CalculationType;
        this.ControlAccount = ControlAccount;
        this.Percentage = Percentage;
        this.Amount = Amount;
    }
}
  
  