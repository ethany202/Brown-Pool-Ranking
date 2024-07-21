
require('dotenv').config()
const express = require("express");
const nodemailer = require('nodemailer')
const executeQuery = require('./src/services/connection');
const path = require('path')

const app = express();
const clubEmail = "brownpoolclubtest@gmail.com";
const brownRegex = new RegExp(".+@brown.edu")
const risdRegex = new RegExp(".+@risd.edu")

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    service: 'gmail',
    auth: {
        user: clubEmail,
        pass: process.env.EMAIL_PASS
    },
});


function storeToken(email, userName, token) {
    try {
        const selectQuery = `SELECT email FROM player_ranks WHERE email = '${email}'`

        executeQuery(selectQuery, (results) => {
            if (results.length == 0) {
                const deleteQuery = "DELETE FROM user_tokens WHERE email = '" + email + "'"
                const updateQuery = `INSERT INTO user_tokens VALUES ('${email}', '${userName}', ${token})`

                executeQuery(deleteQuery, console.log)
                executeQuery(updateQuery, console.log)

                sendConfirmationEmail(email, userName, token)
            }
        })
    }

    catch (error) {
        console.log(error)
    }
}

function sendConfirmationEmail(email, userName, confirmID) {
    const confirmLink = "http://" + process.env.APP_HOST + "/new-member?email=" + email + "&id=" + confirmID;
    let mailOptions = {
        from: clubEmail,
        to: email,
        subject: '[Brown Pool Club] Email Confirmation',
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


function addMember(email, password, token) {
    try {
        // Change to SELECT email ==> for efficiency
        const selectQuery = `SELECT * FROM user_tokens WHERE email = '${email}'`;

        executeQuery(selectQuery, (results) => {
            if (results[0].token == token) {

                const insertRank = `INSERT INTO player_ranks(name, played, points, email) VALUES ('${results[0].name}', 0, 0, '${email}')`
                const removeToken = `DELETE FROM user_tokens WHERE email = '${email}'`

                const insertCreds = `INSERT INTO player_creds VALUES ('${email}', '${password}')`

                executeQuery(insertRank, console.log)
                executeQuery(removeToken, console.log)

                executeQuery(insertCreds, console.log)
            }
        })
    }
    catch (error) {
        console.log(error)
    }
}

// Adds in built-in middleware: middleware parses incoming JSON requests and puts parsed data into "req.body"
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'brown-pool-frontend', 'build')));

// Routing:
app.post("/join", (req, res) => {
    const confirmID = Math.floor((Math.random() * 201)) - 100;    // range of -100 to 100
    const email = req.body.email
    const userName = req.body.name;

    if (brownRegex.test(email) || risdRegex.test(email)) {
        storeToken(email, userName, confirmID)
    }
})

// POST request to "/leaderboard"
app.post("/leaderboard", (req, res) => {
    try {
        const selectQuery = "SELECT * , ROW_NUMBER() OVER ( ORDER BY points DESC) AS rank_number FROM player_ranks"

        executeQuery(selectQuery, (results) => {
            res.json({ list: results })
        })
        // res.json({
        //     list: [
        //         {
        //             "email": "ethan_ye@brown.edu",
        //             "name": "Ethan Ye", "played": 0,
        //             "points": 0,
        //             "rank_number": 1,
        //             "user_id": 1
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 2,
        //             "user_id": 2
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 3,
        //             "user_id": 3
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 4,
        //             "user_id": 4
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 5,
        //             "user_id": 5
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 6,
        //             "user_id": 6
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 7,
        //             "user_id": 7
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 8,
        //             "user_id": 8
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 9,
        //             "user_id": 9
        //         },
        //         {
        //             "email": "ben_woods@penn.edu",
        //             "name": "Ben Woods",
        //             "played": 0,
        //             "points": 0,
        //             "rank_number": 10,
        //             "user_id": 10
        //         },
        //     ]
        // })
    }
    catch (error) {
        console.log(error)
    }
});

// POST request to add new member to rating ladder.
app.post("/new-member", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const token = req.body.id;

    addMember(email, password, token)
    res.json({ "email": email })
})

// POST request to check if a user login is valid
app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const selectQuery = `SELECT email FROM player_creds WHERE email = '${email}' AND password = '${password}'`

    executeQuery(selectQuery, (results) => {
        if (results.length == 1) {
            res.json({ email: email })
        }
        else {
            res.json({})
        }
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'brown-pool-frontend', 'build/index.html'))
})

// Starting Server:
const port = process.env.PORT || 80;  // Sets the port either to its preset port or port 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});