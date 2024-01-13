import "./header.scss";
import logo from "./logo.png";
import { AiFillBell } from "react-icons/ai";
import { FaMoon, FaAngleDown } from "react-icons/fa";
import FollowButton from "../Utils/FollowButton.js";
import { useEffect, useState } from "react";
import ProfileOptions from "../ProfileOptions/ProfileOptions.js";
import { authorizedGetRequest } from "../../utils/authorizedRequest.js";
import Notifications from "../Notifications/Notifications.js";
import axios from "axios";

function Header({socket}) {
  const username = window.localStorage.getItem("username");
  const profilePhoto = window.localStorage.getItem("profilePhoto");
  const [searchToggle, setSearchToggle] = useState(false);
  const [notifToggle, setNotifToggle] = useState(false) 
  const [searchedInput, setSearchedInput] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [optionsToggle, setOptionsToggle] = useState(false);
  let [notificationCounter, setNotificationCounter] = useState(0)

  function closeSearchResults() {
    setSearchedInput("");
    setSearchToggle(false);
  }

  async function searching(e) {
    try {
      const searchTerm = e.target.value.trim() === "" ? "" : e.target.value.trim();
      setSearchedInput(searchTerm);

      const result = await authorizedGetRequest(`https://laugher-server.onrender.com/user/search/${searchTerm}`);
      if (result && result.data !== null) {
        setSearchedUsers(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getNotificationCounter(){
    const headers = {
      accessToken: window.localStorage.getItem("accessToken"),
      refreshToken: window.localStorage.getItem("refreshToken")
    }
    const config = {
      headers: headers
    }
    try {
      const data = await axios.get("https://laugher-server.onrender.com/notifications/notification-counter", config)
      setNotificationCounter(data.data.notification_counter)
    } catch (error) {
      console.log(error)
      if(!document.URL.includes("auth")){
        window.location = "/auth/signin"
      }

    }

  }

  function clickNotifications(){
    setNotifToggle(!notifToggle)
    if(notifToggle){
      setNotificationCounter(0)
    }
  }

  socket.on("receive-notification", ()=>{
    console.log("Primio sam")
    setNotificationCounter(notificationCounter + 1)
  })

  useEffect(()=>{
    getNotificationCounter()
  }, [])

  return (
    <header>
      <div id="logo-container">
        <img src={logo} alt="Logo not found" />
        <h1>Laugher</h1>
      </div>

      {notifToggle ? <Notifications setNotifToggle={setNotifToggle} notifToggle={notifToggle}/> : ""}

      {username ? (
        <>
          <div id="search-container">
            <input
              value={searchedInput}
              onChange={(e) => searching(e)}
              onClick={() => setSearchToggle(true)}
              id="search"
              type="text"
              placeholder=" 🔍 Search"
            />
          </div>
          {searchToggle && (
            <div id="search-results-container">
              {searchedUsers.length === 0 ? (
                <p id="empty-message">No results</p>
              ) : (
                searchedUsers.map((user) => (
                  <div className="search-result" key={user.id}>
                    <div id="user-info" onClick={() => window.location = `/user/${user.id}`}>
                      <img src={user.profile_picture_url != null ? user.profile_picture_url : process.env.PUBLIC_URL + "/default_profile.png"} alt="" />
                      <h4>{user.username}</h4>
                    </div>
                    <FollowButton followId={user.receiver_id} userId={user.id} />
                  </div>
                ))
              )}

              <button onClick={() => closeSearchResults()} id="close-search-btn">
                X Close
              </button>
            </div>
          )}
          <div id="header-icons">
            <div id="notification-icon-container">
              <AiFillBell onClick={()=>clickNotifications()}/>
              {notificationCounter === 0 ? "" : <div id="notification-counter"><b>{notificationCounter>9 ? "9+" : notificationCounter}</b></div>}
            </div>

            <div id="profile-settings" onClick={() => setOptionsToggle(!optionsToggle)} >
              <img src={profilePhoto !== "null" ? profilePhoto : process.env.PUBLIC_URL + "/default_profile.png"} alt={username} />
              <p>
                <b>{username}</b>
              </p>
              <FaAngleDown id="angle-down" />


            </div>
          </div>
          {optionsToggle && <ProfileOptions />}
        </>
      ) : (
        ""
      )}
    </header>
  );
}

export default Header;
