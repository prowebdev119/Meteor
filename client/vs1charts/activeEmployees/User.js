export default class User {
  constructor({ id, employeeName, lastLogin, avatar}) {
    this.id = id;
    this.employeeName = employeeName;
    this.lastLogin = lastLogin;
    this.avatar = avatar;
  }
}
