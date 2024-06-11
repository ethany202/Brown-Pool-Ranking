import React from 'react'
import "./HomePage.css"
import { useState, useEffect } from 'react'

export default function HomePage() {

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")

    const sendJoinRequest = (event) => {
        event.preventDefault();
        console.log(email)

        // Replace with POST request to server ==> server handles request by sending email
        fetch('join', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                name: name
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
            .catch(err => console.log(err))

        alert("An email has been sent for confirmation.")
    }

    useEffect(() => {
        document.title = 'Home | Brown Pool Club'
    }, []);

    return (
        <div className="home-page-container">
            <div className="title-background">
                <div className="club-title">
                    <h1 className="home-title">Brown Pool Club</h1>
                </div>
            </div>

            <div className="club-logistics">
                <h4 className="about-title">
                    About the Club
                </h4>
                <p className="club-logistics-paragraphs">
                    The Brown Pool Club welcomes Brown and RISD students of any experience to come play pool. Club meetings take place at <a href="https://maps.app.goo.gl/y7wuYf2owHUwz9619">Faunce House </a>
                    on Fridays, from 8:00 pm to 10:00 pm. We hope to see you here!
                </p>
                <div className="meeting-map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2973.066063059585!2d-71.4055066248355!3d41.82687556862119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e4453cdf566e05%3A0x31af308579278cf4!2sFaunce%20House%2C%2075%20Waterman%20St%2C%20Providence%2C%20RI%2002912!5e0!3m2!1sen!2sus!4v1718081379478!5m2!1sen!2sus" width="500" height="400" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>

            </div>
            <div className="player-signup">
                <h4 className="compete-title">
                    Want to Compete?
                </h4>
                <p className="club-logistics-paragraphs">
                    Want to compete and see how you rank among your peers? The Brown Pool Club provides a point-based rating system, where members compete to gain points and climb the leaderboard (points reset each school semester). Join the competition by filling out the following form (only Brown and RISD students can participate).
                </p>
                <form className="join-form" onSubmit={sendJoinRequest}>
                    <input className="email-input" type="text" placeholder="Email (@brown.edu)" onChange={(event) => setEmail(event.target.value)} />
                    <br></br>
                    <input className="email-input" type="text" placeholder="Name" onChange={(event) => setName(event.target.value)} />
                    <br></br>
                    <button className="join-button" type='submit'>Join</button>
                </form>
            </div>
        </div>
    )
}