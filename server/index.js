
// Initialize variables at beginning...
const express = require("express");     // Creating a server:
// const request = require('request');
const nodemailer = require('nodemailer');
const app = express();
const mysql = require('mysql2');
const clubEmail = "brownpoolclubtest@gmail.com";
var playerRanks = []


// Helper functions...
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    service: 'gmail',
    auth: {
        user: 'brownpoolclubtest@gmail.com',
        pass: 'znkq bdpg mxba jmln'
    },

});

function storeToken(email, userName, token) {
    try {
        const pool = mysql.createPool({
            host: 'h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'jxyzt66x865bq36b',
            password: 'leg6l9ntlg3onv5u',
            database: 'c2j23eaw50719szw',
        });

        pool.getConnection((err, conn) => {
            if (err instanceof Error) {
                console.log(err)
                return;
            }

            conn.query("DELETE FROM user_tokens WHERE email = '" + email + "'", (err, result, fields) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(result)
                }
            })

            conn.query("INSERT INTO user_tokens VALUES (?, ?, ?)", [email, userName, token], (err, results, fields) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("ADDING TOKEN>>>>")
                }
            })

            conn.release()
        });
    }

    catch (error) {
        console.log(error)
    }
}

function sendConfirmationEmail(email, userName) {
    let confirmID = Math.floor((Math.random() * 201)) - 100;    // range of -100 to 100

    storeToken(email, userName, confirmID)

    let confirmLink = "http://localhost:5000/new-member?email=" + email + "&id=" + confirmID;

    let mailOptions = {
        from: clubEmail,
        to: email,
        subject: '[Brown Pool Club] Email Confirmation',
        // text: 'Confirm your email: '
        html: "<h4>Hi " + userName + ",</h4><p>Confirm your email with the link to join Brown Pool Club's competitive ladder: <a href=" + confirmLink + "> Email Confirmation </a> </p>"
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
        const pool = mysql.createPool({
            host: 'h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'jxyzt66x865bq36b',
            password: 'leg6l9ntlg3onv5u',
            database: 'c2j23eaw50719szw',
        });

        pool.getConnection((err, conn) => {
            if (err instanceof Error) {
                console.log(err)
                return;
            }

            conn.query(`SELECT * FROM user_tokens WHERE email = '${email}'`, (err, results, fields) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log(results)
                    if (results[0].token == token) {
                        console.log("ADDING PLAYER NOWWWWW")

                        let insertRank = 'INSERT INTO player_ranks(name, played, points, email) VALUES (?, ?, ?, ?)'
                        let rankParams = [results[0].name, 0, 0, email]

                        conn.query(insertRank, rankParams, (err, results, field) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log("ADDED USER>>>>>>>>>")
                                console.log(results)
                            }
                        });

                        let removeToken = `DELETE FROM user_tokens WHERE email = '${email}'`

                        conn.query(removeToken, (err, results, field) => {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log("TOKEN REMOVED")
                            }
                        })
                    }
                }
            })

            conn.release();
        });
    }
    catch (error) {
        console.log(error)
    }
}

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

app.post("/join", (req, res) => {
    // request(
    //     { url: 'http://localhost:5000/join' },
    //     (error, response, body) => {
    //         if (error || response.statusCode !== 200) {
    //             console.log("ERROR")
    //         }
    //         else {
    //             console.log("New Member Join")
    //             console.log(res.json())
    //         }
    //     }
    // )
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

// GET request to "/leaderboard"
app.get("/leaderboard", (req, res) => {
    try {
        const pool = mysql.createPool({
            host: 'h2cwrn74535xdazj.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
            user: 'jxyzt66x865bq36b',
            password: 'leg6l9ntlg3onv5u',
            database: 'c2j23eaw50719szw'
        });

        pool.getConnection((err, conn) => {
            if (err instanceof Error) {
                console.log(err);
                return;
            }

            pool.query("SELECT * FROM player_ranks ORDER BY points", (err, results, fields) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("GETTING PLAYERS...")

                    jsonFormat = {
                        list: results
                    }
                    res.json(jsonFormat);
                }
            })

            conn.release()
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


// Starting Server:
const port = process.env.PORT || 5000;  // Sets the port either to its preset port or port 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});