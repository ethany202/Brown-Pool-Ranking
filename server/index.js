
// Initialize variables at beginning...
const express = require("express");     // Creating a server:
const request = require('request')
const app = express();
const mysql = require('mysql2');

// Adds in built-in middleware: middleware parses incoming JSON requests and puts parsed data into "req.body"
app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});


// GET request to "/home"
app.get("/home", (req, res) => {
    console.log("REACHED HOME")

})

var playerRanks = []

// async function retrievePlayerRanks() {
//     let connString = "postgresql://ethan:l4RxXmaCgIiTbzoHM46gHg@brown-pool-7591.g8z.gcp-us-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"

//     const { Client } = require('pg')
//     const client = new Client(connString);

//     client.connect(function (err) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             console.log("Connected")
//         }
//     });

//     const result = await client.query('SELECT * FROM player_ranks')
//     await client.end()
// }

function getPlayerRanks() {
    // create a new MySQL connection
    const connection = mysql.createConnection({
        host: 'h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'jxyzt66x865bq36b',
        password: 'leg6l9ntlg3onv5u',
        database: 'c2j23eaw50719szw'
    });
    // connect to the MySQL database
    connection.connect((error) => {
        if (error) {
            console.error('Error connecting to MySQL database:', error);
        } else {
            console.log('Connected to MySQL database!');
        }
    });

    connection.query("SELECT * FROM player_ranks ORDER BY points", function (err, result, fields) {
        if (err) {
            throw err;
        }
        console.log(result);
        playerRanks = result;
    });

    connection.end();
}

// GET request to "/leaderboard"
app.get("/leaderboard", (req, res) => {
    // Return template of specific html file
    //res.sendFile(`${templates}/leaderboard.html`);
    // res.json({ "users": ["userOne", "userTwo"] })
    jsonFormat = {
        list: [{ user_id: 202, name: "Ethan Ye", played: 0, points: 0 }, { user_id: 1, name: "Alfie Clive", played: 0, points: 0 }]
    }
    return res.json(jsonFormat);
    //getPlayerRanks();


});


// Starting Server:
const port = process.env.PORT || 5000;  // Sets the port either to its preset port or port 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});