const mysql = require('mysql2')

var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_SCHEMA,
});

const executeQuery = (query, callback) => {
    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            throw err;
        }
        console.log("Connection Successful")
        conn.query(query, (err, results, field) => {
            conn.release();
            if (!err) {
                callback(results)
            }
            else {
                console.log(err);
            }
        })
        conn.on('error', (err) => {
            throw err;
        })
    })
}

module.exports = executeQuery;