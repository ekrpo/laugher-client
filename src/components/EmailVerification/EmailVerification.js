import { useState } from "react"
import "./email-verification.scss"
import axios from "axios"


function EmailVerification() {
    const [code, setCode] = useState(0)

    function submit(e) {
        e.preventDefault()

        axios.post("https://laugher-server.onrender.com/auth/email-verification", {
            verificationCode:code
        })
        .then(result => {
            window.location = "/auth/signin"
        })
        .catch(err => {
            console.error(err)
        })
    }

    return <div id="verification-container">
        <h1 id="verification-title">You need to verificate your email</h1>
        <p id="verification-text">On your entered email address we sent email verification code. It is 6 digit code. You have to enter that in input field below.</p>
        <form id="verification-form" onSubmit={(e)=>submit(e)}>
            <label for="code">
                <input type="number" id="code" name="code" placeholder="Enter verification code" value={code} onChange={e=>setCode(e.target.value)}></input>
            </label>
            <button id="submit">Verificate</button>
        </form>
    </div>
}

export default EmailVerification