/**
 * @type {{type: string, fields: UserFields}}
 */
export default class User {
  constructor({ type, fields }) {
    this.type = type;
    this.fields = fields;
  }
}

export class UserFields {
  constructor({
    Active,
    EmployeeId,
    EmployeeName,
    GlobalRef,
    ID,
    ISEmpty,
    IsVS1User,
    KeyStringFieldName,
    KeyValue,
    LogonName,
    LogonPassword,
    Logon_Name,
    MsTimeStamp,
    MsUpdateSiteCode,
    PasswordDate,
    PasswordHash,
    Recno,
  }) {
    this.Active = Active;
    this.EmployeeId = EmployeeId;
    this.EmployeeName = EmployeeName;
    this.GlobalRef = GlobalRef;
    this.ID = ID;
    this.ISEmpty = ISEmpty;
    this.IsVS1User = IsVS1User;
    this.KeyStringFieldName = KeyStringFieldName;
    this.KeyValue = KeyValue;
    this.LogonName = LogonName;
    this.LogonPassword = LogonName;
    this.Logon_Name = Logon_Name;
    this.MsTimeStamp = MsTimeStamp;
    this.MsUpdateSiteCode = MsUpdateSiteCode;
    this.PasswordDate = PasswordDate;
    this.PasswordHash = PasswordHash;
    this.Recno = Recno;
  }
}
