import React from 'react'
import logo from '../assets/BrownLogo.png'
import './SiteHeader.css'
import cueSticks from '../assets/BilliardsDesign.png'


export default function SiteHeader() {
    return (
        <div className="header-container">
            <img className="logo" src={logo} />
            {/* <img className="cue-sticks-design" src={cueSticks}></img> */}

            <div className="page-links">
                <a className="site-header-links" href="/home">Home</a>
                <a className="site-header-links" href="/leaderboard">Leaderboard</a>
                <a className="site-header-links" href="/events">Events</a>
                <a className="site-header-links" href="/team">Meet the Team</a>
            </div>
        </div>
    )
}