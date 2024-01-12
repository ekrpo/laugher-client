import { useEffect, useState } from "react"
import "./profile_summary.scss"
import {authorizedGetRequest} from "../../utils/authorizedRequest"

function ProfileSummary({userId}){


    const profilePhoto = window.localStorage.getItem("profilePhoto")
    
    const [usersInfo, setUsersInfo] = useState({})
    let Error = "";
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const result = await authorizedGetRequest(`https://laugher-server.onrender.com/user/info/${userId || 0}`)
                if(result && result.data != null){
                    setUsersInfo({...usersInfo, 
                        followings: result.data.followings, 
                        followers: result.data.followers, 
                        numberofjokes: Number(result.data.numberofjokes),
                        firstName: result.data.first_name,
                        lastName: result.data.last_name,
                        username: result.data.username,
                        profilePhoto:result.data.profile_picture_url
                    })
                    return
                }
                return
            } catch (error) {
                console.log(error)
            }

        }
        fetchData()
    }, [])


    return <div id="profile-summary-outer" style={window.innerWidth>1024 ? {width:"95%", marginLeft:"25px"}:null}>
        <div id="profile-summary-inner" onClick={()=>window.location = "/user/profile"}>
            <div id="general-info">
                <img src={usersInfo.profilePhoto != null ? profilePhoto : process.env.PUBLIC_URL + '/default_profile.png'}/>
                <div>
                    <h4>{usersInfo.firstName} {usersInfo.lastName}</h4>
                    <p className="statistic-text">@{usersInfo.username}</p>
                </div>
            </div>
            <div id="profile-statistics">
                <div>
                    <p className="statistic-number"><b>{usersInfo.followers}</b></p>
                    <p className="statistic-text">Followers</p>
                </div>
                <div>
                    <p className="statistic-number"><b>{usersInfo.followings}</b></p>
                    <p className="statistic-text">Followings</p>
                </div>
                <div>
                    <p className="statistic-number"><b>{usersInfo.numberofjokes}</b></p>
                    <p className="statistic-text">Jokes</p>
                </div>
            </div>
        </div>
        {Error}
    </div>
}

export default ProfileSummary