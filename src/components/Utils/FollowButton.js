import { useState } from "react"
import "./follow_button.scss"
import { authorizedPutRequest } from "../../utils/authorizedRequest"

function FollowButton({ accessToken, userId, followId}) {
    const [following, setFollowing] = useState(followId ? true : false)
    const id = window.localStorage.getItem("id")

    async function follow(userId){
        const {data, err } = await authorizedPutRequest(`https://laugher-server.onrender.com/follow/${userId}`, accessToken)
        if(data != null){
            setFollowing(true)
        }
    }
    async function unfollow(userId){
        const {data, err } = await authorizedPutRequest(`https://laugher-server.onrender.com/follow/undo/${userId}`, accessToken)
        if(data != null){
            setFollowing(false)
        }

    }
    console.log("Da vidimo:", id==userId)
    return following ? <button className={id == userId ? "me follow-btns":"follow-btns"} onClick={()=>unfollow(userId)} id="unfollow-btn">Unfollow</button> : <button className={id == userId ? "me follow-btns":"follow-btns"} onClick={()=>follow(userId)} id="follow-btn" disabled={id==userId ? true:false}>Follow</button>
}

export default FollowButton