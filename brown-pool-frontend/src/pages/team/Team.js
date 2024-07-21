import React from "react";
import AnonProfile from '../../assets/AnonProfile.png'
import './Team.css'


export default function Team(props) {
    //let teamMembers = props.teamMembers

    return (
        <div className="results-div">

            <div className="coach-results">
                <h2 className="team-title">Meet the Team</h2>

                <br></br>
                <ul className="coach-grid">
                    {/* {
                        coachRes.map((currentCoach) => {
                            return (
                                <li className="individual-coach" id={currentCoach.id} onClick={() => viewCoach(currentCoach.name)}>
                                    <img className="coach-img" src={coachImage} />
                                    <h3 className="coach-result-name">{currentCoach.name}</h3>
                                    <div className="coach-school">
                                        {currentCoach.school}
                                    </div>
                                    <div className="coach-rating">
                                        Rating: {currentCoach.rating} ({currentCoach.num_reviews} reviews)
                                    </div>
                                </li>

                            )
                        })
                    } */}

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