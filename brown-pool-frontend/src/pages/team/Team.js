import React from "react";
import AnonProfile from '../../assets/AnonProfile.png'
import './Team.css'


export default function Team() {

    return (
        <div className="results-div">
            <div className="coach-results">
                <h2 className="team-title">Meet the Team</h2>
                <br></br>
                <ul className="coach-grid">
                    <li className="individual-coach">
                        <img className="coach-img" src={AnonProfile} />
                        <h3 className="coach-result-name">Alfie Clive</h3>
                        <div className="coach-school">
                            President
                        </div>
                        <div className="coach-rating">
                            <a href="mailto:alfie@email.com"> alfie@email.com</a>
                        </div>
                    </li>

                    <li className="individual-coach">
                        <img className="coach-img" src={AnonProfile} />
                        <h3 className="coach-result-name">Kenneth Rhee</h3>
                        <div className="coach-school">
                            Co-President
                        </div>
                        <div className="coach-rating">
                            <a href="mailto:alfie@email.com"> alfie@email.com</a>
                        </div>
                    </li>
                    <li className="individual-coach">
                        <img className="coach-img" src={AnonProfile} />
                        <h3 className="coach-result-name">Ethan Ye</h3>
                        <div className="coach-school">
                            Secretary
                        </div>
                        <div className="coach-rating">
                            <a href="mailto:alfie@email.com"> alfie@email.com</a>
                        </div>
                    </li>

                    <li className="individual-coach">
                        <img className="coach-img" src={AnonProfile} />
                        <h3 className="coach-result-name">Alfie Clive</h3>
                        <div className="coach-school">
                            Club President
                        </div>
                        <div className="coach-rating">
                            <a href="mailto:alfie@email.com"> alfie@email.com</a>
                        </div>
                    </li>

                    <li className="individual-coach">
                        <img className="coach-img" src={AnonProfile} />
                        <h3 className="coach-result-name">Alfie Clive</h3>
                        <div className="coach-school">
                            Club President
                        </div>
                        <div className="coach-rating">
                            <a href="mailto:alfie@email.com"> alfie@email.com</a>
                        </div>
                    </li>

                    <li className="individual-coach">
                        <img className="coach-img" src={AnonProfile} />
                        <h3 className="coach-result-name">Alfie Clive</h3>
                        <div className="coach-school">
                            Club President
                        </div>
                        <div className="coach-rating">
                            <a href="mailto:alfie@email.com"> alfie@email.com</a>
                        </div>
                    </li>

                </ul>
            </div>


        </div>
    )
}