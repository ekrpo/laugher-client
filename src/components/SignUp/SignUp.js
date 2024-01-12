import "./signup.scss";
import { useState } from "react";
import axios from "axios"
import Error from "../Error/Error"


function SignUp() {
    const [userData, setUserData] = useState({})
    const [error, setError] = useState(undefined)

    function handleChange(e) {
        let name = e.target.name
        const value = e.target.value

        setUserData({ ...userData, [name] : value })
    }

    function submit(e) {
        e.preventDefault()

        axios.post("https://laugher-server.onrender.com/auth/signup", userData)
        .then(result => {
            const response = result.data
            window.location = response.redirectUrl
        })
        .catch(err => {
            setError(err.response.data.errMessage)
            console.error(err)
        })
    }

    return <form id="signup-form" onSubmit={(e)=>submit(e)}>
        <div id="title-container">
            <h2 id="auth-title">Create account</h2>
        </div>
        {error ? <Error errorMsg={error}/>:""}
        <label for="username">
            <input  
            type="text" 
            id="username" 
            name="username" 
            placeholder="Username"
            value={userData.username} onChange={e=>handleChange(e)}></input>
        </label>

        <div id="names">
            <label for="firstName">
                <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                placeholder="First name"
                value={userData.firstName} onChange={e=>handleChange(e)}></input>
            </label>

            <label for="lastName">
                <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                placeholder="Last name"
                value={userData.lastName} onChange={e=>handleChange(e)}></input>
            </label>
        </div>


        <label for="email">
            <input 
            type="text" 
            id="email" 
            name="email" 
            placeholder="Email"
            value={userData.email} onChange={e=>handleChange(e)}></input>
        </label>

        <label id="birthday-label" for="birthday">Enter your birtday 🎂         
        <input 
            type="date" 
            id="birthday" 
            name="birthday" 
            placeholder="Birthday"
            value={userData.birthday} onChange={e=>handleChange(e)}></input>
        </label>

        <label for="password">
            <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Password"
            value={userData.password} onChange={e=>handleChange(e)}></input>
        </label>

        <label for="confirmedPassword">
            <input 
            type="password" 
            id="confirmedPassword" 
            name="confirmedPassword" 
            placeholder="Confirm password"
            value={userData.confirmedPassword} onChange={e=>handleChange(e)}></input>
        </label>

        <button id="submit">Sign up</button>
        <p id="alternative-option">If you already have account you can go to <a href="/auth/signin">signin</a></p>
    </form>
}

export default SignUp