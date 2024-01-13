import "./suggestions.scss"
import FollowButton from "../Utils/FollowButton.js"
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi"
import { useEffect, useState } from "react"
import { authorizedGetRequest } from "../../utils/authorizedRequest.js"


function Suggestions({accessToken}) {
    const [suggestions, setSuggestions] = useState([])
    function getSuggestions(){

            const fetchData = async () => {
                try {
                    const result = await authorizedGetRequest("https://laugher-server.onrender.com/user/suggest", accessToken)
                    if(result.data != null){
                        setSuggestions(result.data)
                        return
                    }
                    return
                } catch (error) {
                    console.log(error)
                }
            }
            fetchData()



    }

    useEffect(()=>{
        getSuggestions()
    },[])


    return <div id="suggested-profiles-list">
        {suggestions && suggestions.map(user => {
            return <div id="profile-item">
                <div id="users-data" onClick={() => window.location = `/user/${user.id}`}>
                    <img id="sugg-profile-picture" src={user.profile_picture_url != null ? user.profile_picture_url : "default_profile.png"} alt="" />
                    <h4>{user.username}</h4>
                </div>
                <div id="btn-container">
                    <FollowButton accessToken={accessToken} followId={null} userId={user.id}/>
                </div>
            </div>
        })}

        <div id="container-random">
            <button id="random-suggestions-btn" onClick={()=>getSuggestions()}>

                    <GiPerspectiveDiceSixFacesRandom/>
                    Random

            </button>
        </div>
    </div>
}

export default Suggestions
