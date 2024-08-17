const mysql = require('mysql2')
require('dotenv').config()

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
});

const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, conn) {
            if (err) {
                return reject(err);
            }
            resolve(conn);
        });
    });
}

const executeQuery = async (query) => {
    const conn = await getConnection()

    return new Promise((resolve, reject) => {
        conn.query(query, (err, results, field) => {
            conn.release()
            if (err) {
                return reject(err)
            }
            resolve(results)
        })
    })
}


module.exports.getConnection = getConnection
module.exports.executeQuery = executeQuery