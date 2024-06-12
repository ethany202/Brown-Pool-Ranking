import React from "react";

import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

import './Register.css'

export default function Register() {
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')

    const [searchParams] = useSearchParams()

    const email = searchParams.get("email")
    const token = searchParams.get("token")

    const h2Style = {
        fontSize: '5vw',
        margin: '5vw',
    }

    const h4Style = {
        fontSize: '1.75vw',
        color: '#B2BEB5',
        fontWeight: '350',
    }

    const submitUser = (event) => {
        event.preventDefault()

        console.log("Pass: " + password);
        console.log("Confirm pass: " + confirmPass);
        // Send POST request to /new-member
        // If successful ==> close current page
        window.location.href = "/home"
    }

    return (
        <div className="register-body">
            <h2 style={h2Style}>Student Register</h2>
            <div className="input-body">
                <form className="register-form" onSubmit={submitUser}>
                    <h4 style={h4Style} className="email-loc">Email: {email}</h4>
                    <input className="register-input" type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)}></input>
                    <br></br>
                    <input className="register-input" type="password" placeholder="Confirm Password" onChange={(event) => setConfirmPass(event.target.value)}></input>
                    <br></br>
                    {/* Add element here to display when messages are NOT equal */}
                    <button className="register-button" type='submit'>Confirm</button>
                </form>
            </div>
        </div>
    )
}