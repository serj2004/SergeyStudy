const {httpClient} = require("./httpClient.js");

class Api{
    static async postRequest(path, body){
        return await httpClient.post(path, body);
    }
}
module.exports = {Api}