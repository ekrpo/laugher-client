import "../SignUp/signup.scss";
import axios from "axios"
import { useState } from "react";
import Error from "../Error/Error";


function SignIn() {
    const [credidentials, setCredidentials] = useState({})
    const [error, setError] = useState(undefined)

    function changeHandler(e) {
        const name = e.target.name
        const value = e.target.value

        setCredidentials({...credidentials, [name] : value})
    }

    function submit(e) {
        e.preventDefault()

        axios.post("/auth/signin", credidentials)
        .then(result => {
            const redirectUrl = result.data.redirectUrl
            window.localStorage.setItem("username", result.data.username)
            window.localStorage.setItem("profilePhoto", result.data.profilePhoto)
            window.localStorage.setItem("firstName", result.data.firstName)
            window.localStorage.setItem("lastName", result.data.lastName)
            window.localStorage.setItem("id", result.data.id)
            window.location = redirectUrl
        })
        .catch(err => {
            setError(err.response.data.errMessage)
            console.error(err)
        })
    }


    return <form id="signup-form" onSubmit={(e)=>submit(e)}>
        <div id="title-container">
            <h2 id="auth-title">Sign in</h2>
        </div>
        {error ? <Error errorMsg={error}/>:""}
        <label for="usernameOrEmail">
            <input  
            type="text" 
            id="usernameOrEmail" 
            name="usernameOrEmail" 
            placeholder="Username or email"
            value={credidentials.usernameOrEmail}
            onChange={(e) => changeHandler(e)}></input>
        </label>

        <label for="password">
            <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Password"
            value={credidentials.password}
            onChange={(e) => changeHandler(e)}></input>
        </label>

        <button id="submit">Sign in</button>
        <p id="alternative-option">If you don't have account you can  <a href="/auth/signup">signup</a></p>
    </form>
}

export default SignIn