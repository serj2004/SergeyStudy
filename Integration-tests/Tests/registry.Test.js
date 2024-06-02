const {httpClient} = require("../Main/httpClient");
const {createDBClient} = require("../Main/DBClient.js");
const {getUserRecordByLogin} = require("../Main/DBUtils.js");
const {expect} = require("@jest/globals");
const {RegistryBuilder} = require("../Main/RegistryBuilder.js");
const {Api} = require("../Main/Api.js");


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
            const bodyParams = new RegistryBuilder();
            const response = await Api.postRequest('/registry',
                bodyParams);
            const result = await getUserRecordByLogin(DBClient, bodyParams.login);

            expect(response.status).toEqual(200);
            expect(bodyParams.name).toEqual(result[0].Name);
            expect(bodyParams.login).toEqual(result[0].Login);
            expect(bodyParams.role).toEqual(result[0].Role);
        });
    });

    describe('Негативные проверки', () => {
        it("Проверка валидации логина", async () => {
            const bodyParams = new RegistryBuilder()
                .setLogin(`login${Math.random()}@email`);
            const response = await httpClient.post('/registry',
                bodyParams
            );
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('InvalidEmailFormat');
        });
        it("Проверка валидации пароля на кириллицу", async () => {
            const bodyParams = new RegistryBuilder()
                .setPassword("1*Пароль");
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('PasswordMissingUppercase');//Баг?
        });
        it("Проверка валидации пароля на длинну", async () => {
            const bodyParams = new RegistryBuilder()
                .setPassword("1*Passw");
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('PasswordTooShort');
        });
        it("Проверка валидации пароля на отсутствие цифры", async () => {
            const bodyParams = new RegistryBuilder()
                .setPassword("*Password");
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('PasswordMissingDigit');
        });
        it("Проверка валидации пароля на отсутствие спецсимвола", async () => {
            const bodyParams = new RegistryBuilder()
                .setPassword("Password1");
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual('PasswordMissingSpecialCharacter');
        });
        it("Проверка валидации роли", async () => {
            const bodyParams = new RegistryBuilder().setRole("admin");
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual("InvalidRole");
        });
        it("Проверка валидации на длинну строки в поле имени", async () => {
            const bodyParams = new RegistryBuilder().setName("M".repeat(51));
            const response = await httpClient.post('/registry',
                bodyParams);
            expect(response.status).toEqual(400);
            expect(response.data[0].code).toEqual("NameIsTooLong");
        });
        it("Проверка создания дублирующего пользователя", async () => {
            const bodyParams = new RegistryBuilder();
            await httpClient.post('/registry',
                bodyParams);
            const responseNew = await httpClient.post('/registry',
                bodyParams);
            expect(responseNew.status).toEqual(409);
            expect(responseNew.data[0].code).toEqual("UserAlreadyExist");
        })
    });
});
