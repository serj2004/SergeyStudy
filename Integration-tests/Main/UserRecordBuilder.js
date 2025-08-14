const uuid = require("uuid");
const {generatePasswordHash} = require("./Utils.js");

class UserRecordBuilder{
    constructor(passwordHash) {
        this.UserId = uuid.v4();
        this.Name = "John";
        this.Login = `login${Math.random()}@email.com`;
        this.Role = "client";
        this.PasswordHash = passwordHash;
    }
    setUserId(UserId){
        this.UserId = UserId;
        return this;
    }
    setName(Name){
        this.Name = Name;
        return this;
    }
    setLogin(Login){
        this.Login = Login;
        return this;
    }
    setRole(Role){
        this.Role = Role;
        return this;
    }
    setPasswordHash(PasswordHash){
        this.PasswordHash = PasswordHash;
        return this;
    }
}
module.exports = {UserRecordBuilder}