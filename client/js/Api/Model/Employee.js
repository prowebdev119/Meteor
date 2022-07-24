import { isEmpty, times } from "lodash";
import UserModel from "./User";

export default class Employee {
  constructor({ type, fields }) {
    this.type = type;
    this.fields = fields;
  }
}

/**
 * @type {{User: UserModel}}
 */
export class EmployeeFields {
  constructor({
    ABN,
    Active,
    AlHours,
    Allowances,
    AltContact,
    AltPhone,
    AnnuitySuperPension,
    Area,
    AreaRange,
    Award,
    BasisOfPayment,
    CallPriority,
    Canvasser,
    CdeProject,
    CdepWageTotal,
    CgtExempt,
    Classification,
    ClientID,
    Commission,
    CommissionFlatRate,
    CommissionInvoiceExPrice,
    CommissionLastPaid,
    CommissionOn,
    CommissionOnValue,
    Company,
    ConcessionalComponent,
    Country,
    CreationDate,
    CustFld1,
    DateFinished,
    DateSigned,
    DateStarted,
    DaysPost30061983,
    DaysPre01071983,
    Deductions,
    DefaultClassID,
    DefaultClassName,
    DefaultContactMethod,
    DefaultInvoiceTemplateID,
    DOB,
    Email,
    EmailsFromEmployeeAddress,
    EmployeeHasCommission,
    EmployeeName,
    EmployeeNo,
    ExtraTax,
    ExtraTaxOptions,
    FamilyTaxBenefit,
    FaxNumber,
    FirstName,
    FringeBenefits,
    GlobalRef,
    GoogleEmail,
    GooglePassword,
    Gross,
    Hecsindicator,
    HecsTaxScale,
    ID,
    IncomeType,
    Initials,
    IsCommissionOnPaidInvoice,
    ISEmpty,
    IsOnTheRoster,
    IsTerminated,
    KeyStringFieldName,
    KeyValue,
    LastName,
    LastPaid,
    LastPayPeriod,
    LastUpdated,
    LeaveLoading,
    LoadHoursFromRoster,
    LoadLeaveFromRoster,
    MealBreakHours,
    MealBreakThreshold,
    MiddleName,
    Mobile,
    MsTimeStamp,
    MsUpdateSiteCode,
    Net,
    NextOfKin,
    NextOfKinPhone,
    NextOfKinRelationship,
    NonQualifyingComponent,
    Notes,
    onPMRoster,
    OptionNo,
    OverHeadBaseRate,
    OverheadRate,
    PayNotes,
    Payperiod,
    PaySuperonLeaveLoading,
    PayVia,
    Pensioner,
    Phone,
    PhotoIDVaildFromDate,
    PhotoIDVaildToDate,
    Position,
    PostCode,
    ProductHasCommission,
    Recno,
    Rep,
    RepCode,
    ReportsTo,
    Resident,
    SalesTarget,
    SendPayslipViaEmail,
    Sex,
    SickHours,
    SignaturePresent,
    SkypeName,
    State,
    Street,
    Street2,
    Street3,
    StudentLoanIndicator,
    StudentLoanTaxScale,
    Suburb,
    Sundries,
    Super,
    SynchWithGoogle,
    Tax,
    TaxFreeThreshold,
    TaxScaleID,
    TFN,
    TFNExemption,
    TfnApplicationMade,
    Title,
    TrackSales,
    UndeductedContribution,
    Under18,
    UseAward,
    UseClassificationAdvance,
    UseoFtFnForSuper,
    User,
    Wages,
    WorkersCompInsurer,
    WorkersCompRate,
    WorkPhone,
    ZoneDependentSpecial,
    EmploymentBasis,
    ResidencyStatus,
    StudyTrainingSupportLoan,
    EligibleToReceiveLeaveLoading,
    OtherTaxOffsetClaimed,
    UpwardvariationRequested,
    SeniorandPensionersTaxOffsetClaimed,
    HasApprovedWithholdingVariation
  }) {
    this.ABN = ABN;
    this.Active = Active;
    this.AlHours = AlHours;
    this.Allowances = Allowances;
    this.AltContact = AltContact;
    this.AltPhone = AltPhone;
    this.AnnuitySuperPension = AnnuitySuperPension;
    this.Area = Area;
    this.AreaRange = AreaRange;
    this.Award = Award;
    this.BasisOfPayment = BasisOfPayment;
    this.CallPriority = CallPriority;
    this.Canvasser = Canvasser;
    this.CdeProject = CdeProject;
    this.CdepWageTotal = CdepWageTotal;
    this.CgtExempt = CgtExempt;
    this.Classification = Classification;
    this.ClientID = ClientID;
    this.Commission = Commission;
    this.CommissionFlatRate = Commission;
    this.CommissionInvoiceExPrice = Commission;
    this.CommissionLastPaid = CommissionLastPaid;
    this.CommissionOn = CommissionOn;
    this.CommissionOnValue = CommissionOnValue;
    this.Company = Company;
    this.ConcessionalComponent = ConcessionalComponent;
    this.Country = Country;
    this.CreationDate = CreationDate;
    this.CustFld1 = CustFld1;
    this.DateFinished = DateFinished;
    this.DateSigned = DateSigned;
    this.DateStarted = DateStarted;
    this.DaysPost30061983 = DaysPost30061983;
    this.DaysPre01071983 = DaysPre01071983;
    this.Deductions = Deductions;
    this.DefaultClassID = DefaultClassID;
    this.DefaultClassName = DefaultClassName;
    this.DefaultContactMethod = DefaultContactMethod;
    this.DefaultInvoiceTemplateID = DefaultInvoiceTemplateID;
    this.DOB = DOB;
    this.Email = Email;
    this.EmailsFromEmployeeAddress = EmailsFromEmployeeAddress;
    this.EmployeeHasCommission = EmployeeHasCommission;
    this.EmployeeName = EmployeeName;
    this.EmployeeNo = EmployeeNo;
    this.ExtraTax = ExtraTax;
    this.ExtraTaxOptions = ExtraTaxOptions;
    this.FamilyTaxBenefit = FamilyTaxBenefit;
    this.FaxNumber = FaxNumber;
    this.FirstName = FirstName;
    this.FringeBenefits = FringeBenefits;
    this.GlobalRef = GlobalRef;
    this.GoogleEmail = GoogleEmail;
    this.GooglePassword = GooglePassword;
    this.Gross = Gross;
    this.Hecsindicator = Hecsindicator;
    this.HecsTaxScale = HecsTaxScale;
    this.ID = ID;
    this.IncomeType = IncomeType;
    this.Initials = Initials;
    this.IsCommissionOnPaidInvoice = IsCommissionOnPaidInvoice;
    this.ISEmpty = isEmpty;
    this.IsOnTheRoster = IsOnTheRoster;
    this.IsTerminated = IsTerminated;
    this.KeyStringFieldName = KeyStringFieldName;
    this.KeyValue = KeyValue;
    this.LastName = LastName;
    this.LastPaid = LastPaid;
    this.LastPayPeriod = LastPayPeriod;
    this.LastUpdated = LastUpdated;
    this.LeaveLoading = LeaveLoading;
    this.LoadHoursFromRoster = LoadHoursFromRoster;
    this.LoadLeaveFromRoster = LoadLeaveFromRoster;
    this.MealBreakHours = MealBreakHours;
    this.MealBreakThreshold = MealBreakThreshold;
    this.MiddleName = MiddleName;
    this.Mobile = Mobile;
    this.MsTimeStamp = MsTimeStamp;
    this.MsUpdateSiteCode = MsUpdateSiteCode;
    this.Net = Net;
    this.NextOfKin = NextOfKin;
    this.NextOfKinPhone = NextOfKinPhone;
    this.NextOfKinRelationship = NextOfKinRelationship;
    this.NonQualifyingComponent = NonQualifyingComponent;
    this.Notes = Notes;
    this.onPMRoster = onPMRoster;
    this.OptionNo = OptionNo;
    this.OverHeadBaseRate = OverHeadBaseRate;
    this.OverheadRate = OverheadRate;
    this.PayNotes = PayNotes;
    this.Payperiod = Payperiod;
    this.PaySuperonLeaveLoading = PaySuperonLeaveLoading;
    this.PayVia = PayVia;
    this.Pensioner = Pensioner;
    this.Phone = Phone;
    this.PhotoIDVaildFromDate = PhotoIDVaildFromDate;
    this.PhotoIDVaildToDate = PhotoIDVaildToDate;
    this.Position = Position;
    this.PostCode = PostCode;
    this.ProductHasCommission = ProductHasCommission;
    this.Recno = Recno;
    this.Rep = Rep;
    this.RepCode = RepCode;
    this.ReportsTo = ReportsTo;
    this.Resident = Resident;
    this.SalesTarget = SalesTarget;
    this.SendPayslipViaEmail = SendPayslipViaEmail;
    this.Sex = Sex;
    this.SickHours = SickHours;
    this.SignaturePresent = SignaturePresent;
    this.SkypeName = SkypeName;
    this.State = State;
    this.Street = Street;
    this.Street2 = Street2;
    this.Street3 = Street3;
    this.StudentLoanIndicator = StudentLoanIndicator;
    this.StudentLoanTaxScale = StudentLoanTaxScale;
    this.Suburb = Suburb;
    this.Sundries = Sundries;
    this.Super = Super;
    this.SynchWithGoogle = SynchWithGoogle;
    this.Tax = Tax;
    this.TaxFreeThreshold = TaxFreeThreshold;
    this.TaxScaleID = TaxScaleID;
    this.TFN = TFN;
    this.TFNExemption = TFNExemption;
    this.TfnApplicationMade = TfnApplicationMade;
    this.Title = Title;
    this.TrackSales = TrackSales;
    this.UndeductedContribution = UndeductedContribution;
    this.Under18 = Under18;
    this.UseAward = UseAward;
    this.UseClassificationAdvance = UseClassificationAdvance;
    this.UseoFtFnForSuper = UseoFtFnForSuper;

    if (User instanceof UserModel) {
      this.User = User;
    } else {
      this.User = new UserModel(User);
    }
    
    this.Wages = Wages;
    this.WorkersCompInsurer = WorkersCompInsurer;
    this.WorkersCompRate = WorkersCompRate;
    this.WorkPhone = WorkPhone;
    this.ZoneDependentSpecial = ZoneDependentSpecial;
    this.EmploymentBasis = EmploymentBasis;
    this.ResidencyStatus = ResidencyStatus;
    this.StudyTrainingSupportLoan = StudyTrainingSupportLoan;
    this.EligibleToReceiveLeaveLoading = EligibleToReceiveLeaveLoading;
    this.OtherTaxOffsetClaimed = OtherTaxOffsetClaimed;
    this.UpwardvariationRequested = UpwardvariationRequested;
    this.SeniorandPensionersTaxOffsetClaimed = SeniorandPensionersTaxOffsetClaimed;
    this.HasApprovedWithholdingVariation = HasApprovedWithholdingVariation;
  }
}
