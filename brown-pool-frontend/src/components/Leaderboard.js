import React from 'react';
import './LeaderboardStyles.css'
import { useState, useEffect } from 'react'

export default function Leaderboard() {
    // Empty list of JSON objects; each JSON corresponds to a member
    const [playerRanks, setPlayerRanks] = useState({ list: [] })
    let currentPosition = 0;

    useEffect(() => {
        //fetch() is a built-in JavaScript function responsible for making fetches (get/post/ other requests)
        fetch('http://localhost:5000/leaderboard', {
            mode: "cors"
        })
            .then(response => response.json())
            .then(data => setPlayerRanks(data))
            .catch(err => console.log(err))
    }, [])

    console.log(playerRanks)

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
                        {
                            playerRanks.list && (
                                // the currentMember is a JSON item
                                playerRanks.list.map((currentMember) => {
                                    currentPosition += 1;
                                    return (
                                        <tr className="member-rows" key={currentMember.user_id}>
                                            <td>{currentPosition}</td>
                                            <td>{currentMember.name}</td>
                                            <td>{currentMember.played}</td>
                                            <td>{currentMember.points}</td>
                                        </tr>
                                    )
                                })
                            )
                        }

                        {/* <tr className="member-rows">
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
                        </tr> */}
                    </tbody>

                </table>
            </div>

        </div>

    );
}