import "./messenger.scss";
import { authorizedGetRequest } from "../../../utils/authorizedRequest.js";
import { useState, useEffect } from "react";
import ChatBox from "../../ChatBox/ChatBox.js";

function Messenger({accessToken, socket}) {
  const [following, setFollowing] = useState([]);
  const [chatToggle, setChatToggle] = useState(false);
  const [chatUser, setChatUser] = useState({});
  const [filtered, setFiltered] = useState(following);
  const [search, setSearch] = useState("");


  useEffect(() => {
    getFollowingUsers();
  }, []);



  function searching(e) {
    setSearch(e.target.value);
    setFiltered(following.filter((user) => user.username.includes(search)));
  }

  async function getFollowingUsers() {
    try {
      const { data } = await authorizedGetRequest("https://laugher-server.onrender.com/follow/get/following", accessToken);
      if (data != null) {
        setFollowing(data);
        setFiltered(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function closeChat() {
    setChatToggle(false);
    setChatUser({});
  }

  function openChat(user) {
    setChatToggle(true);
    setChatUser(user);
  }
  const location = document.URL

  return (
    <section id="messenger-section">
      <div style={!location.includes("messenger") && window.innerWidth < 878  ? {display:"none"} : {}} id="messenger-container">
        <div id="messenger-header">
          <h1>Messages</h1>
        </div>
        <div id="messenger-search-form">
          <input
            value={search}
            onChange={(e) => searching(e)}
            placeholder="Search for conversations"
            id="messenger-search"
            name="messenger-search"
          />
        </div>
        {filtered.map((user) => (
          <div onClick={() => openChat(user)} id="messenger-item" key={user.id}>
            <div id="user-data">
              <div id="messenger-image-container">
                <img
                  src={user.profile_picture_url || process.env.PUBLIC_URL + "/default_profile.png"}
                  alt=""
                />
                <div id="active-status"></div>
              </div>
              <h4>{user.username}</h4>
            </div>
          </div>
        ))}
      </div>
      {chatToggle ? <ChatBox accessToken={accessToken} socket={socket} user={chatUser} closeChat={closeChat} /> : ""}
    </section>
  );
}

export default Messenger;
