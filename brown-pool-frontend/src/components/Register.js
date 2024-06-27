import React from "react";

import { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { registerUser } from "../api/api";

import './Register.css'

export default function Register() {
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [warnMsg, setWarnMsg] = useState('')

    const [searchParams] = useSearchParams()

    const email = searchParams.get("email")
    const token = searchParams.get("id")

    const h2Style = {
        fontSize: '5vw',
        margin: '5vw',
    }

    const boldFont = {
        fontWeight: 'bold'
    }

    const h4Style = {
        fontSize: '1.75vw',
        color: 'black',
        fontWeight: '350',
    }

    const errMsg = {
        fontSize: '1.35vw',
        color: 'red'
    }

    async function registerPost(email, password, token) {
        try {
            const response = await registerUser(email, password, token)
            window.location.href = "/home"
        }
        catch (error) {
            console.log(error)
        }
    }

    const submitUser = (event) => {
        event.preventDefault()

        if (password == confirmPass) {
            registerPost(email, password, token)
        }
        else {
            setWarnMsg("Passwords do not match!")
        }
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
                    <button className="register-button" type='submit'>Confirm</button>
                </form>
            </div>
        </div>
    )
}