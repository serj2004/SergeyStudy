const {httpClient} = require("../Main/httpClient");
const {createDBClient} = require("../Main/DBClient.js");
const {getUserRecordByLogin} = require("../Main/DBUtils.js");
const {expect} = require("@jest/globals");


describe("Проверка ручки registry", () => {
    describe('Проверка хеппи паса', () => {
        let DBClient;

        beforeAll(async () => {
            DBClient = createDBClient()
        });
        afterAll(async () => {
            await DBClient.destroy()
        });

        it("post registry", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email.com`,
                "password": "1*Password",
                "name": "Max",
                "role": "client"
            };

            const response = await httpClient.post('/registry', bodyParams);

            expect(response.status).toEqual(200);

            const result = await getUserRecordByLogin(DBClient, bodyParams.login);

            expect(bodyParams.name).toEqual(result[0].Name);
            expect(bodyParams.login).toEqual(result[0].Login);
            expect(bodyParams.role).toEqual(result[0].Role);
        });
    });

    describe('Негативные проверки', () => {
        it("Проверка валидации логина", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email`,
                "password": "1*Password",
                "name": "Max",
                "role": "client"
            }
            const response = await httpClient.post('/registry',
                bodyParams
            );
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('InvalidEmailFormat');
        });
        it("Проверка валидации пароля на кириллицу", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email.com`,
                "password": "1*Пароль",
                "name": "Max",
                "role": "client"
            }
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('PasswordMissingUppercase');//Баг?
        });
        it("Проверка валидации пароля на длинну", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email.com`,
                "password": "1*Passw",
                "name": "Max",
                "role": "client"
            }
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('PasswordTooShort');
        });
        it("Проверка валидации пароля на отсутствие цифры", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email.com`,
                "password": "*Password",
                "name": "Max",
                "role": "client"
            }
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('PasswordMissingDigit');
        });
        it("Проверка валидации пароля на отсутствие спецсимвола", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email.com`,
                "password": "Password1",
                "name": "Max",
                "role": "client"
            }
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('PasswordMissingSpecialCharacter');
        });
        it("Проверка валидации роли", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email.com`,
                "password": "1*Password",
                "name": "Max",
                "role": "admin"
            }
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual("InvalidRole");
        });
        it("Проверка валидации URL", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email.com`,
                "password": "1*Password",
                "name": "Max",
                "role": "client"
            }
            const response = await httpClient.post('/registr',
                bodyParams);
            expect(response.status).toEqual(404);
        });
        it("Проверка валидации на длинну строки в поле имени", async () => {
            const bodyParams = {
            "login": `login${Math.random()}@email.com`,
            "password": "1*Password",
            "name": "M".repeat(51),
            "role": "client"
        }
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual("NameIsTooLong");
        });
        it("Проверка создания дублирующего пользователя", async () => {
            const bodyParams = {
                "login": `login${Math.random()}@email.com`,
                "password": "1*Password",
                "name": "M",
                "role": "client"
            }
            const bodyParamsNew = {
                "login": bodyParams.login,
                "password": bodyParams.password,
                "name": bodyParams.name,
                "role": bodyParams.role
            }
            await httpClient.post('/registry',
                bodyParams);
            const responseNew = await httpClient.post('/registry',
                bodyParamsNew);
            expect(responseNew.status).toEqual(409);
            expect(responseNew.data[0].code).toEqual("UserAlreadyExist");
        })
    });
});
