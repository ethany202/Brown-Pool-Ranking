
require('dotenv').config()
const express = require("express");
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./src/services/sql-connection');
const sendConfirmationEmail = require('./src/services/email-sender');

const app = express();
const brownRegex = new RegExp(".+@brown.edu")
const risdRegex = new RegExp(".+@risd.edu")

async function storeToken(email, userName, token) {
    try {
        const results = await db.executeQuery(`SELECT email FROM player_ranks WHERE email = '${email}'`)

        if (results.length === 0) {
            const deleteQuery = "DELETE FROM user_tokens WHERE email = '" + email + "'"
            const updateQuery = `INSERT INTO user_tokens VALUES ('${email}', '${userName}', ${token})`

            await db.executeQuery(deleteQuery)
            await db.executeQuery(updateQuery)

            sendConfirmationEmail(email, userName, token)
        }
    }
    catch (err) {
        throw err
    }
}

async function addMember(email, password, token) {
    try {
        const tokenResults = await db.executeQuery(`SELECT * FROM user_tokens WHERE email = '${email}'`)

        if (Number(tokenResults[0].token) === Number(token)) {
            //const hashedPassword = await bcrypt.hash(password, 10)

            const insertCreds = `INSERT INTO player_creds(email, password, name) VALUES ('${email}', '${password}', '${results[0].name}')`
            const insertRank = `INSERT INTO player_ranks VALUES ('${email}', 0, 0)`
            const removeToken = `DELETE FROM user_tokens WHERE email = '${email}'`

            await db.executeQuery(insertRank)
            await db.executeQuery(removeToken)
            await db.executeQuery(insertCreds)
        }
    }
    catch (err) {
        throw err
    }
}

async function updateMatchStatus(matchID, winnerID) {
    try {
        const updateQuery = `
            UPDATE ongoing_matches
            SET winner_id = ${winnerID}
            WHERE match_id = ${matchID}
        `

        await db.executeQuery(updateQuery)
    }
    catch (err) {
        throw err
    }
}

async function incrementGamesPlayed(playerOneID, playerTwoID) {
    try {
        const incrementQuery = `
            UPDATE player_ranks
            SET played = played + 1
            WHERE user_id = ${playerOneID} OR user_id = ${playerTwoID}
        `

        await db.executeQuery(incrementQuery)
    }
    catch (err) {
        throw err
    }
}

async function updateLeaderboard(playerOneID, playerTwoID, winnerID) {
    try {
        const playerOnePtsResult = await db.executeQuery(`SELECT points FROM player_ranks WHERE user_id = ${playerOneID}`)
        const playerTwoPtsResult = await db.executeQuery(`SELECT points FROM player_ranks WHERE user_id = ${playerTwoID}`)

        const playerOnePts = Number(playerOnePtsResult[0].points)
        const playerTwoPts = Number(playerTwoPtsResult[0].points)

        updateLeaderboardHelper(playerOneID, playerOnePts, playerTwoID, playerTwoPts, winnerID)
    }
    catch (err) {
        throw err
    }
}

async function updateLeaderboardHelper(playerOneID, playerOnePts, playerTwoID, playerTwoPts, winnerID) {
    try {
        const pointSum = playerOnePts + playerTwoPts

        if (Number(winnerID) === Number(playerOneID)) {
            const advantage = playerOnePts / pointSum
            const earnedPoints = 10 * (0.5 / advantage)
            const lostPoints = earnedPoints / 2

            console.log(advantage, earnedPoints, lostPoints)

            playerOnePts = Math.round(playerOnePts + earnedPoints)
            playerTwoPts = Math.round(playerTwoPts - lostPoints)
        }
        else {
            const advantage = playerTwoPts / pointSum
            const earnedPoints = 10 * (0.5 / advantage)
            const lostPoints = earnedPoints / 2

            playerOnePts = Math.round(playerOnePts - lostPoints)
            playerTwoPts = Math.round(playerTwoPts + earnedPoints)
        }

        const updatePlayerOne = `
            UPDATE player_ranks
            SET points = ${playerOnePts}
            WHERE user_id = ${playerOneID}
        `

        const updatePlayerTwo = `
            UPDATE player_ranks
            SET points = ${playerTwoPts}
            WHERE user_id = ${playerTwoID} 
        `

        await db.executeQuery(updatePlayerOne)
        await db.executeQuery(updatePlayerTwo)
    }
    catch (err) {
        throw err
    }
}

// Adds in built-in middleware: middleware parses incoming JSON requests and puts parsed data into "req.body"
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'brown-pool-frontend', 'build')));

// Routing:
app.post("/join", (req, res) => {
    try {
        const confirmToken = Math.floor((Math.random() * 201)) - 100;    // range of -100 to 100

        if (brownRegex.test(email) || risdRegex.test(email)) {
            storeToken(req.body.email, req.body.name, confirmToken)
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ 'error': err })
    }

})

// POST request to "/leaderboard"
app.post("/leaderboard", async (req, res) => {
    try {
        const leaderboard = await db.executeQuery('SELECT * FROM player_ranks_with_position')
        return res.json({ list: leaderboard })
    }
    catch (error) {
        console.log(error)
        res.json({ list: [] })
    }
});

// POST request to add new member to rating ladder.
app.post("/new-member", (req, res) => {
    try {
        addMember(req.body.email, req.body.password, req.body.token)
        return res.status(200).json({ "email": email })
    }
    catch (error) {
        console.log(err)
        return res.status(500).json({})
    }
})

// POST request to check if a user login is valid
app.post("/login", async (req, res) => {
    try {
        const selectQuery = `
            SELECT 
                player_creds.user_id, 
                player_creds.email,
                player_creds.password,
                player_creds.name
            FROM player_creds 
            LEFT JOIN player_ranks_with_position
            ON player_ranks_with_position.email = player_creds.email
            WHERE player_creds.email = '${req.body.email}' AND player_creds.password = '${req.body.password}'
        `

        const results = await db.executeQuery(selectQuery)
        if (results.length === 1) {
            return res.status(200).json(results[0])
        }
        else {
            return res.status(500).json({})
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({})
    }
})

// POST request to send a challenge
app.post('/send-challenge', async (req, res) => {
    try {
        const userID = req.body.userID
        const opponentID = req.body.opponentID

        const createChallenge = `
            INSERT INTO ongoing_matches(player_one_id, player_one_accepted, player_two_id, player_two_accepted, winner_id, responder_id)
            VALUES (${userID}, true, ${opponentID}, null, null, null)
        `
        const challengeResult = await db.executeQuery(createChallenge)
        return res.status(200).json({ message: "Challenge sent", data: challengeResult })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Error when sending a challenge" })
    }
})

// GET request to get all players
app.get('/all-players', async (req, res) => {
    try {
        const allPlayers = await db.executeQuery('SELECT user_id, email FROM player_creds')
        return res.status(200).json({ list: allPlayers })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ list: [] })
    }
})

// POST request to obtain match history
app.post('/match-history', async (req, res) => {
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

        const matchHistory = await db.executeQuery(selectQuery)
        return res.status(200).json({ list: matchHistory })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ list: [] })
    }
})

// POST request to obtain match requests
app.post('/match-requests', async (req, res) => {
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

        const matchRequests = await db.executeQuery(selectQuery)
        return res.status(200).json({ list: matchRequests })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ list: [] })
    }
})

// POST request to obtain ONGOING matches
app.post('/ongoing-matches', async (req, res) => {
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

        const ongoingMatches = await db.executeQuery(selectQuery)
        return res.status(200).json({ list: ongoingMatches })

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ list: [] })
    }
})

// POST request to accept match request
app.post('/accept-challenge', async (req, res) => {
    try {
        const updateMatchStatus = `
            UPDATE ongoing_matches
            SET player_two_accepted = true
            WHERE match_id = ${req.body.matchID}
        `

        const result = await db.executeQuery(updateMatchStatus)
        return res.status(200).json({ message: 'match accepted', data: result })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'error accepting match' })
    }
})

// POST request to decline match request
app.post('/decline-challenge', async (req, res) => {
    try {
        const deleteMatchStatus = `
            DELETE FROM ongoing_matches
            WHERE match_id = ${req.body.matchID}
        `

        const result = await db.executeQuery(deleteMatchStatus)
        return res.status(200).json({ message: 'match declined', data: result })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'error with declining match' })
    }
})

// POST request to set match result
app.post('/send-match-result', async (req, res) => {
    try {
        console.log("ENTERED: " + req.body.matchID)

        const matchID = req.body.matchID
        const winnerID = req.body.winnerID
        const userID = req.body.userID
        const opponentID = req.body.opponentID

        const userRank = await db.executeQuery(`SELECT rank_number FROM player_ranks_with_position WHERE user_id = ${userID}`)
        const opponentRank = await db.executeQuery(`SELECT rank_number FROM player_ranks_with_position WHERE user_id = ${opponentID}`)
        const checkCurrentResult = await db.executeQuery(`SELECT * FROM ongoing_matches WHERE match_id = ${matchID}`)

        if (checkCurrentResult.length === 1) {
            const player_one_id = checkCurrentResult[0].player_one_id
            const player_two_id = checkCurrentResult[0].player_two_id

            var player_one_rank = 0
            var player_two_rank = 0

            if (Number(player_one_id) === Number(userID)) {
                player_one_rank = Number(userRank[0].rank_number)
                player_two_rank = Number(opponentRank[0].rank_number)
            }
            else {
                player_one_rank = Number(opponentRank[0].rank_number)
                player_two_rank = Number(userRank[0].rank_number)
            }

            if (checkCurrentResult[0].winner_id === null) {
                updateMatchStatus(matchID, winnerID)
            }
            else if (Number(checkCurrentResult[0].responder_id) !== Number(userID)
                && Number(checkCurrentResult[0].winner_id) === Number(winnerID)) {

                incrementGamesPlayed(player_one_id, player_two_id)
                updateLeaderboard(player_one_id, player_two_id, winnerID)

                const currentDate = new Date()

                const deleteMatchRecord = `DELETE FROM ongoing_matches WHERE match_id = ${matchID}`
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

                const deleteResult = await db.executeQuery(deleteMatchRecord)
                const updateResult = await db.executeQuery(updateMatchHistory)
            }
            else {
                updateMatchStatus(matchID, winnerID)
            }

            const updateResponderID = `
                UPDATE ongoing_matches
                SET responder_id = ${userID}
                WHERE match_id = ${matchID}
            `

            const updateResponder = await db.executeQuery(updateResponderID)
            return res.status(200).json({ message: "Match result recorded" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "error when recording match" })
    }
})


// POST request for user profile data
app.post('/profile-data', async (req, res) => {
    try {
        let responseJSON = {}
        const email = req.body.email
        const userID = req.body.userID

        const rankQuery = `SELECT * FROM player_ranks_with_position WHERE email = '${email}'`
        const matchesWonQuery = `SELECT match_id FROM match_history WHERE winner_id = ${userID}`
        const allMatchesQuery = `SELECT match_id FROM match_history WHERE player_one_id = ${userID} OR player_two_id = ${userID}`

        const rankResults = await db.executeQuery(rankQuery)
        const matchesWonResults = await db.executeQuery(matchesWonQuery)
        const allMatchesResults = await db.executeQuery(allMatchesQuery)

        if (rankResults.length === 1) {
            responseJSON['currentRank'] = rankResults[0].rank_number
            responseJSON['points'] = rankResults[0].points
            responseJSON['matchesWon'] = matchesWonResults.length
            responseJSON['matchesLost'] = allMatchesResults.length - matchesWonResults.length
        }
        return res.status(200).json(responseJSON)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({})
    }
})

app.post('/reset-data', async (req, res) => {
    try {
        const key = req.body.key
        if (key == process.env.RESET_KEY) {
            const clearHistory = await db.executeQuery('DELETE FROM match_history')
            const clearOngoingMatches = await db.executeQuery('DELETE FROM ongoing_matches')
            const resetPlayed = await db.executeQuery('UPDATE player_ranks SET played = 0')
            const resetRanks = await db.executeQuery(`UPDATE player_ranks SET points = 0`)

            return res.status(200).json({ message: "Reset successful" })
        }
        else {
            return res.status(500).json({ message: "Wrong key" })
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: "error when reseting the database" })
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