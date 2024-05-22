import React from 'react';
import './LeaderboardStyles.css'
import { useState, useEffect } from 'react'

export default function Leaderboard() {
    // Empty list of JSON objects; each JSON corresponds to a member
    const [playerRanks, setPlayerRanks] = useState([{}])

    useEffect(() => {
        //fetch() is a built-in JavaScript function responsible for making fetches (get/post/ other requests)
        fetch('SERVER URL')
            .then(response => response.json())
            .then(data => setPlayerRanks(data))
            .catch(err => console.log(err))
    }, [])

    return (
        <div className="leaderboard-div">
            <div className="leaderboard-banner">
                <h1>Leaderboard</h1>
            </div>
            <div className="rankings-section">
                <table className="leaderboard-table">
                    <thead className="columns">
                        <tr>
                            <th scope="col"><abbr title="Rank">Rank</abbr></th>
                            <th className="member" scope="col">Name</th>
                            <th scope="col"><abbr title="Matches Played">Played</abbr></th>
                            <th scope="col"><abbr title="Points">Points</abbr></th>
                        </tr>
                    </thead>
                    <tbody className="members">
                        <tr className="member-rows">
                            <td>1</td>
                            <td>Alfie Clive</td>
                            <td>104</td>
                            <td>95</td>
                        </tr>
                        <tr className="member-rows">
                            <td>1</td>
                            <td>Alfie Clive</td>
                            <td>104</td>
                            <td>95</td>
                        </tr>
                    </tbody>

                </table>
            </div>

        </div>

    );
}