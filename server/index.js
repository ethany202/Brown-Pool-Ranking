
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

            executeQuery(deleteQuery, (results) => {
                executeQuery(updateQuery, console.log)
            })

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
        executeQuery('SELECT * FROM player_ranks_with_position', (results) => {
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
        const selectQuery = `
            SELECT 
                player_creds.user_id, 
                player_creds.email,
                player_creds.password,
                player_creds.name,
                player_ranks_with_position.rank_number 
            FROM player_creds 
            LEFT JOIN player_ranks_with_position
            ON player_ranks_with_position.email = player_creds.email
            WHERE player_creds.email = '${email}' AND player_creds.password = '${password}'
        `

        executeQuery(selectQuery, async (results) => {
            if (results.length === 1) {
                // const passwordMatch = await bcrypt.compare(password, results[0].password);
                // if (passwordMatch) {
                //     return res.status(200).json({ user_id: results[0].user_id, email: email, name: results[0].name })
                // }
                return res.status(200).json({ user_id: results[0].user_id, email: email, name: results[0].name, rank_number: results[0].rank_number })
            }
            return res.status(500).json({})
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({})
    }
})

// POST request to send a challenge
app.post('/send-challenge', (req, res) => {
    try {
        const userID = req.body.userID
        const opponentID = req.body.opponentID

        const createChallenge = `
            INSERT INTO ongoing_matches(player_one_id, player_one_accepted, player_two_id, player_two_accepted, winner_id)
            VALUES (${userID}, true, ${opponentID}, null, null)
        `
        executeQuery(createChallenge, (results) => {
            res.status(200).json({ message: "Challenge sent" })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Error when sending a challenge" })
    }
})

// GET request to get all players
app.get('/all-players', (req, res) => {
    try {
        executeQuery('SELECT user_id, email FROM player_creds', (results) => {
            res.status(200).json({ list: results })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ list: [] })
    }
})

// POST request to obtain match history
app.post('/match-history', (req, res) => {
    try {
        const userID = req.body.userID
        const selectQuery = `
           SELECT 
                match_id, 
                match_date, 
                winner_id, 
                player_creds.name AS opponent_name,
                player_two_rank AS opponent_rank 
            FROM match_history
            LEFT JOIN player_creds
            ON player_two_id = player_creds.user_id
            WHERE player_one_id=${userID}
            UNION
            SELECT 
                match_id, 
                match_date, 
                winner_id, 
                player_creds.name AS opponent_name,
                player_one_rank AS opponent_rank 
            FROM match_history
            LEFT JOIN player_creds
            ON player_one_id = player_creds.user_id
            WHERE player_two_id=${userID}
            ORDER BY match_date DESC
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

// POST request to obtain match requests
app.post('/match-requests', (req, res) => {
    try {
        const userID = req.body.userID
        const selectQuery = `
            SELECT 
                ongoing_matches.match_id,
                player_creds.user_id AS opponent_id, 
                player_creds.name AS opponent, 
                player_ranks_with_position.rank_number as opponent_rank 
            FROM ongoing_matches 
            LEFT JOIN player_creds
            ON ongoing_matches.player_one_id = player_creds.user_id
            LEFT JOIN player_ranks_with_position
            ON player_creds.email = player_ranks_with_position.email
            WHERE (player_two_id = ${userID} AND player_two_accepted IS NULL)
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

// POST request to obtain ONGOING matches
app.post('/ongoing-matches', (req, res) => {
    try {
        const userID = req.body.userID
        const selectQuery = `
            SELECT 
                match_id,
                player_creds.user_id AS opponent_id,
                player_creds.name AS opponent,
                player_ranks_with_position.rank_number AS opponent_rank,
                true AS is_ongoing_match
            FROM ongoing_matches 
            LEFT JOIN player_creds
            ON player_creds.user_id = ongoing_matches.player_one_id
            LEFT JOIN player_ranks_with_position
            ON player_ranks_with_position.email = player_creds.email
            WHERE (player_two_id = ${userID} AND player_two_accepted IS NOT NULL)
            UNION
            SELECT 
                match_id,
                player_creds.user_id AS opponent_id,
                player_creds.name AS opponent,
                player_ranks_with_position.rank_number AS opponent_rank,
                true AS is_ongoing_match
            FROM ongoing_matches 
            LEFT JOIN player_creds
            ON player_creds.user_id = ongoing_matches.player_two_id
            LEFT JOIN player_ranks_with_position
            ON player_ranks_with_position.email = player_creds.email
            WHERE (player_one_id = ${userID} AND player_two_accepted IS NOT NULL)
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
app.post('/accept-challenge', (req, res) => {
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
app.post('/decline-challenge', (req, res) => {
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
        const matchID = req.body.matchID
        const winnerID = req.body.winnerID
        const userID = req.body.userID
        const userRank = req.body.userRank
        const opponentRank = req.body.opponentRank

        console.log(winnerID)

        // Check if a player has already sent a result:
        const checkCurrentResult = `SELECT * FROM ongoing_matches WHERE match_id = ${matchID}`

        executeQuery(checkCurrentResult, (results) => {
            const player_one_id = results[0].player_one_id
            const player_two_id = results[0].player_two_id

            var player_one_rank = 0
            var player_two_rank = 0

            if (player_one_id === userID) {
                player_one_rank = userRank
                player_two_rank = opponentRank
            }
            else {
                player_one_rank = opponentRank
                player_two_rank = userRank
            }

            if (results[0].winner_id === null) {
                const updateMatchStatus = `
                    UPDATE ongoing_matches
                    SET winner_id = ${winnerID}
                    WHERE match_id = ${matchID}
                `

                return executeQuery(updateMatchStatus, (results) => {
                    res.status(200).json({ message: "Match result recorded" })
                })
            }
            else if (Number(results[0].winner_id) !== Number(winnerID)) {
                console.log("NO MATCH...")

                const deleteMatchRecord = `
                    DELETE FROM ongoing_matches
                    WHERE match_id = ${matchID}
                `

                return executeQuery(deleteMatchRecord, (results) => {
                    res.status(200).json({ message: "Match result recorded" })
                })
            }
            else {
                console.log(`WINNER ID MATCHES: ${winnerID}`)

                const currentDate = new Date()
                const deleteMatchRecord = `
                    DELETE FROM ongoing_matches
                    WHERE match_id = ${matchID}
                `

                return executeQuery(deleteMatchRecord, (results) => {
                    const updateMatchHistory = `
                        INSERT INTO match_history
                        VALUES (
                            ${matchID}, 
                            '${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}', 
                            ${player_one_id},
                            ${player_one_rank},
                            ${player_two_id},
                            ${player_two_rank},
                            ${winnerID}
                        )
                    `

                    executeQuery(updateMatchHistory, (results) => {
                        res.status(200).json({ message: "Match result recorded" })
                    })
                })
            }
        })

    }
    catch (err) {
        res.status(500).json({ error: "error when recording match" })
    }
})


// POST request for user profile data
app.post('/profile-data', (req, res) => {
    try {
        let responseJSON = {}
        const email = req.body.email
        const userID = req.body.userID

        const rankQuery = `SELECT * FROM player_ranks_with_position WHERE email = '${email}'`
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