

async function getUserRecordByLogin(DBClient, login) {

    const result = await DBClient
        .select("*")
        .from("Users")
        .where("Login", login);

    return result;
}

async function addUserRecord(DBClient, userRecord) {

    await DBClient
        .insert(userRecord)
        .into("Users");

}

// async function getUserToken(DBClient, userId) {
//
//     const result = await DBClient
//         .select("Token")
//         .from("Tokens")
//         .where("UserId", userId);
//     return result;
// }

async function getUserTokenExpirationDate(DBClient, userToken) {

    const result = await DBClient
        .select("ExpirationDateTime")
        .from("Tokens")
        .where("Token", userToken);
    return result;
}

module.exports = {getUserRecordByLogin, addUserRecord, getUserTokenExpirationDate}