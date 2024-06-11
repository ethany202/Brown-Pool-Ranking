import React from "react";
import instaIcon from '../assets/InstagramIcon.svg'
import facebookIcon from '../assets/FacebookIcon.svg'
import ytIcon from '../assets/YouTubeIcon.svg'
import './Footer.css'


export default function Footer() {

    const paragraphStyle = {
        fontSize: '1.25vw'
    }

    return (
        <div className="footer-section">
            <div className="contact-us-section" >
                <h5 className="footer-titles">Contact Us</h5>
                <p style={paragraphStyle}>
                    Email: <a href="mailto:ethan.ye0312@gmail.com">ethan.ye0312@gmail.com</a>
                </p>
            </div>

            <div className="social-media-section" >
                <h5 className="footer-titles">Follow Us</h5>
                <div className="social-media-icons">
                    <a className="media-link" href="https://instagram.com">
                        <img className="media-icon" alt="Instagram" src={instaIcon} />
                    </a>
                    <a className="media-link" href="https://facebook.com">
                        <img className="media-icon" alt="Facebook" src={facebookIcon} />
                    </a>
                    <a className="media-link" href="https://youtube.com">
                        <img className="media-icon" alt="YouTube" src={ytIcon} />
                    </a>
                </div>
            </div>
        </div>
    )
}