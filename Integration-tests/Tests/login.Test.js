const {addUserRecord, getUserTokenExpirationDate} = require("../Main/DBUtils.js");
const {httpClient} = require("../Main/httpClient.js");
const {expect} = require("@jest/globals");
const {createDBClient} = require("../Main/DBClient.js");
const uuid = require('uuid');
const {generatePasswordHash} = require("../Main/Utils.js");

describe("Проверка ручки login", () => {
    describe('Проверка хеппи паса', () => {

        let DBClient;

        beforeAll(async () => {
            DBClient = createDBClient()
        });
        afterAll(async () => {
            await DBClient.destroy()
        });

        it("Проверка что токен возвращается", async () => {

            const userRecord = {
                UserId: uuid.v4(),
                Name: "John",
                Login: `login${Math.random()}@email.com`,
                Role: "client",
                PasswordHash: await generatePasswordHash("password")
            }

            await addUserRecord(DBClient, userRecord);
            const response = await httpClient.post('/login',
                {login:userRecord.Login, password:"password"});
            expect(response.status).toEqual(200);
            expect(response.data.accessToken).not.toBeNull();
        })
        it("Проверка что токена нет если комбинация login/password неверная", async () => {

            const userRecord = {
                UserId: uuid.v4(),
                Name: "John",
                Login: `login${Math.random()}@email.com`,
                Role: "client",
                PasswordHash: await generatePasswordHash("password")
            }

            await addUserRecord(DBClient, userRecord);
            const response = await httpClient.post('/login',
                {login:userRecord.Login, password:"passwordd"});
            expect(response.status).toEqual(400);
        })
        it("Проверка что время жизни токена равно 15 минут", async () => {

            const userRecord = {
                UserId: uuid.v4(),
                Name: "John",
                Login: `login${Math.random()}@email.com`,
                Role: "client",
                PasswordHash: await generatePasswordHash("password")
            }

            await addUserRecord(DBClient, userRecord);
            const response = await httpClient.post('/login',
                {login:userRecord.Login, password:"password"});
            const userTokenExpirationDate = await getUserTokenExpirationDate(DBClient, response.data.accessToken);
            const minutes = userTokenExpirationDate[0]["ExpirationDateTime"].toString().split(" ")[4].split(":")[1];

            let currentMinutes = new Date().getMinutes();

            let endMinutes = Number(currentMinutes) + 15;
            if (endMinutes > 60){
                endMinutes -= 60
            }
            expect(Number(minutes)).toEqual(endMinutes);
        })
    })

});