class RegistryBuilder{
    constructor() {
        this.login = `login${Math.random()}@email.com`;
        this.password = "1*Password";
        this.name = 'Max';
        this.role = "client";
    }
    setLogin(login){
        this.login = login;
        return this;
    }
    setPassword(password){
        this.password = password;
        return this;
    }
    setName(name){
        this.name = name;
        return this;
    }
    setRole(role){
        this.role = role;
        return this;
    }
}

module.exports = {RegistryBuilder}