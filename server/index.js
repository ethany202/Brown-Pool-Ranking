
// Initialize variables at beginning...
const express = require("express");     // Creating a server:
const nodemailer = require('nodemailer');
//const cors = require('cors') // ONLY use to bypass CORS policy
const path = require('path')
require('dotenv').config()

const app = express();
var pool = require('./connection.js');
const clubEmail = "brownpoolclubtest@gmail.com";

// Helper functions...
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    service: 'gmail',
    auth: {
        user: clubEmail,
        pass: process.env.EMAIL_PASS
    },
});

function executeQuery(query, callback) {
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

function storeToken(email, userName, token) {
    // Edit ==> only store token if user NOT in DB already (execute SELECT stmt on connection)
    try {
        let deleteQuery = "DELETE FROM user_tokens WHERE email = '" + email + "'"
        let updateQuery = `INSERT INTO user_tokens VALUES ('${email}', '${userName}', ${token})`

        console.log(updateQuery);

        executeQuery(deleteQuery, console.log)
        executeQuery(updateQuery, console.log)
    }

    catch (error) {
        console.log(error)
    }
}

function sendConfirmationEmail(email, userName) {
    let confirmID = Math.floor((Math.random() * 201)) - 100;    // range of -100 to 100

    storeToken(email, userName, confirmID)

    let confirmLink = "http://" + process.env.APP_HOST + "/new-member?email=" + email + "&id=" + confirmID;
    let mailOptions = {
        from: clubEmail,
        to: email,
        subject: '[Brown Pool Club] Email Confirmation',
        // text: 'Confirm your email: '
        html: "<h2>Hi " + userName + ",</h2><p>Confirm your email with the link to join Brown Pool Club's competitive ladder: <a href=" + confirmLink + "> Email Confirmation </a> </p>"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


function addMember(email, token) {
    try {
        // Change to SELECT email ==> for efficiency
        let selectQuery = `SELECT * FROM user_tokens WHERE email = '${email}'`;

        executeQuery(selectQuery, (results) => {
            console.log(results)
            if (results[0].token == token) {
                console.log("ADDING PLAYER NOWWWWW")

                let insertRank = `INSERT INTO player_ranks(name, played, points, email) VALUES ('${results[0].name}', 0, 0, '${email}')`
                let removeToken = `DELETE FROM user_tokens WHERE email = '${email}'`

                executeQuery(insertRank, console.log)
                executeQuery(removeToken, console.log)
            }
        })
    }
    catch (error) {
        console.log(error)
    }
}

// Adds in built-in middleware: middleware parses incoming JSON requests and puts parsed data into "req.body"
app.use(express.json());
//app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'brown-pool-frontend', 'build')));


app.post("/join", (req, res) => {
    console.log("New Member Join")
    console.log(req.body.email)

    const emailRegex = new RegExp(".+@brown.edu")
    email = req.body.email
    userName = req.body.name;

    console.log(emailRegex.test(email))
    if (emailRegex.test(email)) {
        sendConfirmationEmail(email, userName)
    }
})

// POST request to "/leaderboard"
app.post("/leaderboard", (req, res) => {
    // res.json({
    //     list: [{ user_id: 202, name: "Ethan Ye", played: 0, points: 0, email: "ethan_ye@brown.edu" }]
    // })
    try {
        let selectQuery = "SELECT * FROM player_ranks ORDER BY points"

        executeQuery(selectQuery, (results) => {
            res.json({ list: results })
        })
    }
    catch (error) {
        console.log(error)
    }
});


// POST request to add new member to rating ladder.
app.get("/new-member", (req, res) => {
    console.log("NEW USER ADDED TO DATABASE");
    let email = req.query.email;
    let token = req.query.id;

    console.log(token)

    addMember(email, token)

    res.json({ "email": email })
})

app.get('*', (req, res) => {
    //console.log(path.join(__dirname, '..', 'brown-pool-frontend', 'index.html'))
    res.sendFile(path.join(__dirname, '..', 'brown-pool-frontend', 'build/index.html'))
})


// Starting Server:
const port = process.env.PORT || 80;  // Sets the port either to its preset port or port 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});