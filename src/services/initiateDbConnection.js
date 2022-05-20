const { Connection, Request } = require("tedious");

module.exports = function GetConnection() {

    const config = {
        authentication: {
            options: {
            userName: "space-admin",
            password: "(password)"
            },
            type: "default"
        },
        server: "and-space.database.windows.net",
        options: {
            database: "space-db",
            encrypt: true
        }
    };

    const connection = new Connection(config);
    return connection;
}
