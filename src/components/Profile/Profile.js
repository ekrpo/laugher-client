import "./profile.scss";
import { useState, useEffect } from "react";
import { authorizedGetRequest } from "../../utils/authorizedRequest.js";
import ProfileSummary from "../ProfileSummary/ProfileSummary.js";
import JokeContainer from "../IndexLayout/JokeContainer/JokeContainer.js";

function Profile({ setTab }) {
  const [jokes, setJokes] = useState([]);
  const userId = document.URL.split("/")[4] !== "profile" ? document.URL.split("/")[4] : window.localStorage.getItem("id");
  const [offset, setOffset] = useState(0)
  const scrollableElement = document.getElementById("index-page")
  useEffect(() => {
    const fetchUserJokes = async () => {
      try {
        const requestURL = `https://laugher-server.onrender.com/joke/user/${userId}/0`;
        const result = await authorizedGetRequest(requestURL);

        if (result.data) {
          const updatedJokes = result.data.data.map((joke) => ({ ...joke, commentsToggle: false, offset: 0 }));
          setJokes(updatedJokes);
          setOffset(10)
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserJokes();
  }, [userId]);
  const [isLoading, setIsLoading] = useState(false)
  async function getMoreJokes(){
    setIsLoading(true)
    const isNearBottom = scrollableElement.scrollTop + scrollableElement.clientHeight >= scrollableElement.scrollHeight - 1;
    if(isNearBottom){
      const requestURL = `https://laugher-server.onrender.com/joke/user/${userId}/${offset}`;
      const result = await authorizedGetRequest(requestURL);
      if (result.data !== null) {
        if (result.data.data.length === 0) {
          return;
        }
        setJokes((prevJokes) => prevJokes.concat(result.data.data));
        setOffset((prevOffset) => prevOffset + 10);
      }
    }
    setIsLoading(false)
  }
  useEffect(() => {
    if (scrollableElement !== null) {
      scrollableElement.addEventListener("scrollend", getMoreJokes);
      return () => {
        scrollableElement.removeEventListener("scrollend", getMoreJokes);
      };
    }
  }, [scrollableElement, getMoreJokes]);

  return (
    <div id="profile">
      <ProfileSummary userId={userId} />
      <JokeContainer setTab={setTab} jokeList={jokes || []} setJokes={setJokes} />
    </div>
  );
}

export default Profile;
