const {knex} = require("knex");

function createDBClient() {
    const DBConfig = {
        connection: {
            host: "localhost",
            port: "5432",
            database: "sso-postgres",
            user: "postgres",
            password: "postgres"
        },
        client: "pg"
    }

    const DBClient = knex(DBConfig);

    return DBClient;
}

module.exports = {createDBClient}