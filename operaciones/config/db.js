const mysql = require("mysql2/promise");
require("dotenv").config();

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

(async () => {
    try {
        await connection.query("SELECT 1");
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error.message);
    }
})();

module.exports = connection;