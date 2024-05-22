
// Initialize variables at beginning...
const express = require("express");     // Creating a server:
const app = express();
const templates = __dirname + "/public";

// Adds in built-in middleware: middleware parses incoming JSON requests and puts parsed data into "req.body"
app.use(express.json());


// GET request to "/home"
app.get("/home", (req, res) => {
    console.log("REACHED HOME")
    res.sendFile("../clients/public/index.html")
})

// GET request to "/leaderboard"
app.get("/leaderboard", (req, res) => {
    // Return template of specific html file
    //res.sendFile(`${templates}/leaderboard.html`);
    res.json({ "users": ["userOne", "userTwo"] })
});






// Starting Server:
const port = process.env.PORT || 5000;  // Sets the port either to its preset port or port 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});