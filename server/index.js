
require('dotenv').config()
const express = require("express");
const bcrypt = require('bcrypt');
const path = require('path');
const executeQuery = require('./src/services/connection');
const sendConfirmationEmail = require('./src/services/email-sender');

const app = express();
const brownRegex = new RegExp(".+@brown.edu")
const risdRegex = new RegExp(".+@risd.edu")

function storeToken(email, userName, token) {
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

function addMember(email, password, token) {
    const selectQuery = `SELECT * FROM user_tokens WHERE email = '${email}'`

    executeQuery(selectQuery, async (results) => {
        if (results[0].token == token) {
            //const hashedPassword = await bcrypt.hash(password, 10)

            const insertCreds = `INSERT INTO player_creds(email, password, name) VALUES ('${email}', '${password}', '${results[0].name}')`
            const insertRank = `INSERT INTO player_ranks VALUES ('${email}', 0, 0)`
            const removeToken = `DELETE FROM user_tokens WHERE email = '${email}'`

            executeQuery(insertRank, console.log)
            executeQuery(removeToken, console.log)
            executeQuery(insertCreds, console.log)
        }
    })
}

// Adds in built-in middleware: middleware parses incoming JSON requests and puts parsed data into "req.body"
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'brown-pool-frontend', 'build')));

// Routing:
app.post("/join", (req, res) => {
    try {
        const confirmID = Math.floor((Math.random() * 201)) - 100;    // range of -100 to 100
        const email = req.body.email
        const userName = req.body.name;

        if (brownRegex.test(email) || risdRegex.test(email)) {
            storeToken(email, userName, confirmID)
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ 'error': err })
    }

})

// POST request to "/leaderboard"
app.post("/leaderboard", (req, res) => {
    try {
        const selectQuery = `
            SELECT player_creds.email, player_creds.name, player_ranks.played, player_ranks.points,
            ROW_NUMBER() OVER (ORDER BY player_ranks.points DESC) AS rank_number
            FROM player_ranks
            LEFT JOIN player_creds
            ON player_ranks.email = player_creds.email
        `

        executeQuery(selectQuery, (results) => {
            res.json({ list: results })
        })
    }
    catch (error) {
        console.log(error)
        res.json({ list: [] })
    }
});

// POST request to add new member to rating ladder.
app.post("/new-member", (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const token = req.body.id;

        addMember(email, password, token)
        res.status(200).json({ "email": email })
    }
    catch (error) {
        console.log(err)
        res.status(500).json({})
    }
})

// POST request to check if a user login is valid
app.post("/login", (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const selectQuery = `SELECT * FROM player_creds WHERE email = '${email}' and password = '${password}'`

        executeQuery(selectQuery, async (results) => {
            if (results.length == 1) {
                // const passwordMatch = await bcrypt.compare(password, results[0].password);
                // if (passwordMatch) {
                //     return res.status(200).json({ user_id: results[0].user_id, email: email, name: results[0].name })
                // }
                return res.status(200).json({ user_id: results[0].user_id, email: email, name: results[0].name })

            }
            return res.status(500).json({})
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({})
    }
})

// POST request to obtain match history
app.post('/match-history', (req, res) => {
    try {
        const userID = req.body.userID

        const selectQuery = `SELECT * FROM match_history WHERE player_one_id=${userID} OR player_two_id=${userID}`
        executeQuery(selectQuery, (results) => {
            console.log(results)
            res.status(200).json({ list: results })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ list: [] })
    }
})

// POST request to obtain match requests
app.post('/match-requests', (req, res) => {
    try {
        const userID = req.body.userID

        const selectQuery = `
            SELECT * FROM ongoing_matches 
            WHERE (player_one_id = ${userID} AND NOT player_one_accepted)
            OR (player_two_id = ${userID} AND NOT player_two_accepted)
        `

        executeQuery(selectQuery, (results) => {
            res.status(200).json({ list: results })
        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ list: [] })
    }
})

// POST request to accept match request
app.post('/accept-match', (req, res) => {
    try {
        const matchID = req.body.matchID

        const updateMatchStatus = `
            UPDATE ongoing_matches
            SET player_two_accepted = true
            WHERE match_id = ${matchID}
        `

        executeQuery(updateMatchStatus, (results) => {
            res.status(200).json({ message: 'match accepted' })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'error accepting match' })
    }
})

// POST request to decline match request
app.post('/decline-match', (req, res) => {
    try {
        const matchID = req.body.matchID

        const deleteMatchStatus = `
            DELETE FROM ongoing_matches
            WHERE match_id = ${matchID}
        `

        executeQuery(deleteMatchStatus, (results) => {
            res.status(200).json({ message: 'match declined' })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'error with declining match' })
    }
})

// POST request to set match result
app.post('/send-match-result', (req, res) => {
    try {
        const userID = req.body.userID
        const matchID = req.body.matchID
        const winnerID = req.body.winnerID

        //const getOngoingMatches
    }
    catch (err) {

    }
})


// POST request for user profile data
app.post('/profile-data', (req, res) => {
    try {
        let responseJSON = {}
        const email = req.body.email
        const userID = req.body.userID

        const rankQuery = `
            SELECT played, points, 
            ROW_NUMBER() OVER (ORDER BY points DESC) AS rank_number
            FROM player_ranks 
            WHERE email = '${email}'
        `
        const matchesWonQuery = `SELECT match_id FROM match_history WHERE winner_id = ${userID}`
        const allMatchesQuery = `SELECT match_id FROM match_history WHERE player_one_id = ${userID} OR player_two_id = ${userID}`

        executeQuery(rankQuery, (results) => {
            if (results.length == 1) {
                responseJSON['currentRank'] = results[0].rank_number
                responseJSON['points'] = results[0].points
            }
            executeQuery(matchesWonQuery, (results) => {
                responseJSON['matchesWon'] = results.length
                executeQuery(allMatchesQuery, (results) => {
                    responseJSON['matchesLost'] = results.length - responseJSON['matchesWon']
                    res.status(200).json(responseJSON)
                })
            })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({})
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'brown-pool-frontend', 'build/index.html'))
})

// Starting Server:
const port = process.env.PORT || 80;  // Sets the port either to its preset port or port 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});