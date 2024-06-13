import React from "react";

import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

import './Register.css'

export default function Register() {
    // useState Variables
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [warnMsg, setWarnMsg] = useState('')

    const [searchParams] = useSearchParams()

    const email = searchParams.get("email")
    const token = searchParams.get("id")

    // Other Variables:

    const h2Style = {
        fontSize: '5vw',
        margin: '5vw',
    }

    const boldFont = {
        fontWeight: 'bold'
    }

    const h4Style = {
        fontSize: '1.75vw',
        // color: '#B2BEB5',
        color: 'black',
        fontWeight: '350',
    }

    const errMsg = {
        fontSize: '1.35vw',
        color: 'red'
    }

    const submitUser = (event) => {
        event.preventDefault()

        console.log(email)
        console.log("Pass: " + password);
        console.log("Confirm pass: " + confirmPass);

        if (password == confirmPass) {
            fetch("new-member", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password,
                    id: token
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            })
                .then(response => window.location.href = "/home")
                .catch(err => console.log(err))
        }
        else {
            setWarnMsg("Passwords do not match!")
        }

        // Send POST request to /new-member
        // If successful ==> close current page
    }

    return (
        <div className="register-body">
            <h2 style={h2Style}>Student Register</h2>
            <div className="input-body">
                <form className="register-form" onSubmit={submitUser}>
                    <h4 style={h4Style} className="email-loc">Email: <span style={boldFont}> {email}</span> </h4>
                    <input className="register-input" type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)}></input>
                    <br></br>
                    <input className="register-input" type="password" placeholder="Confirm Password" onChange={(event) => setConfirmPass(event.target.value)}></input>
                    <br></br>
                    {
                        warnMsg &&
                        <div>
                            <div style={errMsg}>{warnMsg}</div>
                            <br></br>
                        </div>
                    }

                    {/* Add element here to display when messages are NOT equal */}
                    <button className="register-button" type='submit'>Confirm</button>
                </form>
            </div>
        </div>
    )
}