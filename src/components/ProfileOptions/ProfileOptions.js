import "./profile_options.scss"
import axios from "axios"

export function logOut(){
    const headers = {
        accessToken: window.localStorage.getItem("accessToken"),
        refreshToken: window.localStorage.getItem("refreshToken")
      }
      const config = {
        headers: headers
      }
      config.headers.accessToken = accessToken
    axios.delete("https://laugher-server.onrender.com/auth/signout", config)
    .then(res=>{
        localStorage.clear()
        window.location=res.data.redirectUrl
    })
    .catch(err=>{
        console.log(err)
    })
}

function ProfileOptions(){
    return <div id="profile-options">
        <div onClick={()=>logOut()} id="logout" className="option">
            <h3>Logout</h3>
        </div>
    </div>
}

export default ProfileOptions