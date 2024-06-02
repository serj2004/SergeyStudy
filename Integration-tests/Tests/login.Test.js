const {addUserRecord, getUserTokenExpirationDate} = require("../Main/DBUtils.js");
const {httpClient} = require("../Main/httpClient.js");
const {expect} = require("@jest/globals");
const {createDBClient} = require("../Main/DBClient.js");
const uuid = require('uuid');
const {generatePasswordHash} = require("../Main/Utils.js");
const {UserRecordBuilder} = require("../Main/UserRecordBuilder.js");

describe("Проверка ручки login",  () => {
    describe('Проверка хеппи паса', () => {

        let DBClient;
        let validPassword;
        let passwordHash;
        let userRecord;

        beforeAll(async () => {
            DBClient = createDBClient()
            validPassword = "password";
            passwordHash = await generatePasswordHash(validPassword);
        });

        beforeEach(async () => {
            userRecord = new UserRecordBuilder(passwordHash);
            await addUserRecord(DBClient, userRecord);
        });

        afterAll(async () => {
            await DBClient.destroy()
        });

        it("Проверка что токен возвращается", async () => {

            const response = await httpClient.post('/login',
                {login: userRecord.Login, password: validPassword});
            expect(response.status).toEqual(200);
            expect(response.data.accessToken).not.toBeNull();
        })
        it("Проверка что токена нет если комбинация login/password неверная", async () => {

            const invalidPassword = "passwordd";
            const response = await httpClient.post('/login',
                {login: userRecord.Login, password: invalidPassword});
            expect(response.status).toEqual(400);
        })
        it("Проверка что время жизни токена равно 15 минут", async () => {

            const response = await httpClient.post('/login',
                {login: userRecord.Login, password: validPassword});
            const userTokenExpirationDate = await getUserTokenExpirationDate(DBClient, response.data.accessToken);
            expect(Math.round(((new Date(userTokenExpirationDate[0]["ExpirationDateTime"]
                .toString())) - new Date()) / 60 / 1000)).toEqual(15);
        })
    })

});