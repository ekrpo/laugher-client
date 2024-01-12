import { useEffect, useState } from "react"
import "./notifications.scss"
import axios from "axios"
import { dateTimeFormat } from "../../utils/dataFormats"


function Notifications({setNotifToggle, notifToggle}){
    const [notifications, setNotifications] = useState([])

    function formatNotification(type){
        switch (type) {
            case "reaction":
                return " reacted on your joke"
            case "comment":
                return " commented below your joke"
            case "like":
                return " liked your comment"
            case "follow":
                return " followed you"
        }
    }

    async function getUserNotifications(){
        try {
            const data = await axios.get("https://laugher-server.onrender.com/notifications")
            await axios.put("https://laugher-server.onrender.com/notifications/clear-counter")
            console.log(data.data)
            setNotifications(data.data.reverse())
            

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{
        getUserNotifications()
    }, [])

    return <div id="notifications">
        {notifications.map(notification=>{
            return <div id="notification">
                <div id="user-info">
                    <img src={process.env.PUBLIC_URL + "/default_profile.png"} alt="" />
                    <h4>{notification.username}</h4>
                </div>
                <p id="notif-text">{formatNotification(notification.type)}</p>
                <p id="notif-time">{dateTimeFormat(notification.time)}</p>
            </div> 
        })}

    </div>
}

export default Notifications