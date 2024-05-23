import React from 'react'
import "./HomePage.css"

export default function HomePage() {
    return (
        <div className="home-page-container">
            <div className="title-background">
                <div className="club-title">
                    <h1 className="home-title">Brown Pool Club</h1>
                </div>
            </div>

            <div className="club-logistics">
                <h4 className="about-title">About the Club</h4>
                <p className="club-logistics-paragraphs">
                    The Brown Pool Club welcomes Brown and RISD students of any experience to come play pool. Club meetings take place at Faunce House
                    on Fridays, from 8:00 pm to 10:00 pm. We hope to see you here! For any questions, contact: <a href="mailto:ethan.ye0312@gmail.com">ethan.ye0312@gmail.com</a>

                </p>

            </div>
            <div className="player-signup">
                <h4 className="compete-title">
                    Want to Compete?
                </h4>
                <p className="club-logistics-paragraphs">
                    Want to compete and see how you rank among your peers? The Brown Pool Club provides a point-based rating system, where members compete to gain points and climb the leaderboard (points reset each school semester). Join the competition by filling out the following form (only Brown and RISD students can participate).
                </p>
                <form>

                </form>
            </div>
        </div>
    )
}