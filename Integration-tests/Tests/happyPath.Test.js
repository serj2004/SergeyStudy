const axios = require("axios");
const {describe, expect, it} = require('@jest/globals');

const baseUrl = 'http://localhost:8080/api/v1'
const bodyParams = {
    "login": `login${Math.random()}@email.com`,
    "password": "1*Password",
    "name": "Max",
    "role": "client"
};

describe('Проверка хеппи паса', () => {
    it("post registry", async() => {
        const response = await axios.post(baseUrl + '/registry', bodyParams);
        expect(response.status).toEqual(200);
    });
    });

describe('Негативные проверки', () => {
    it("post login", async() => {
        const response = await axios.post(baseUrl + '/registry',
            {
                "login": `login${Math.random()}@email`,
                "password": "1*Password",
                "name": "Max",
                "role": "client"
            });
        expect(response.status).toEqual(400);
    });
    it("post password", async() => {
        const response = await axios.post(baseUrl + '/registry',
            {
                "login": `login${Math.random()}@email.com`,
                "password": "1*Пароль",
                "name": "Max",
                "role": "client"
            });
        expect(response.status).toEqual(400);
    });
    it("post role", async() => {
        const response = await axios.post(baseUrl + '/registry',
            {
                "login": `login${Math.random()}@email.com`,
                "password": "1*Password",
                "name": "Max",
                "role": "admin"
            });
        expect(response.status).toEqual(400);
    });
    it("post name length", async() => {
        const response = await axios.post(baseUrl + '/registry',
            {
                "login": `login${Math.random()}@email`,
                "password": "1*Password",
                "name": "Max123456789012345678901234567890123456789012345678",
                "role": "client"
            });
        expect(response.status).toEqual(400);
    });
});