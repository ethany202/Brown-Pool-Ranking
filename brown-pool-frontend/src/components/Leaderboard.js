import React from 'react';
import './LeaderboardStyles.css'
import { useState, useEffect } from 'react'
import { getLeaderboard } from '../api/api';

export default function Leaderboard() {
    const [playerRanks, setPlayerRanks] = useState({ list: [] })
    let currentPosition = 0;

    async function fetchLeaderboard() {
        const leaderboards = await getLeaderboard()
        setPlayerRanks(leaderboards)
    }

    useEffect(() => {
        document.title = 'Leaderboard | Brown Pool Club'
        fetchLeaderboard()
    }, [])

    return (
        <div className="leaderboard-div">
            <div className="leaderboard-banner">
                <h1 className="leaderboard-title">Leaderboard</h1>
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
                    </tbody>
                </table>
            </div>
        </div>

    );
}