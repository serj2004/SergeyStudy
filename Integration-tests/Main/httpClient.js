const axios = require("axios");
const httpClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1'
});

httpClient.defaults.validateStatus = _ => true;

module.exports = {httpClient}