import "./home.scss";
import { useEffect, useState } from "react";
import { authorizedGetRequest } from "../../../utils/authorizedRequest.js";
import JokeContainer from "../../IndexLayout/JokeContainer/JokeContainer.js";
import JokeForm from "../../JokeForm/JokeForm.js";
import ProfileSummary from "../../ProfileSummary/ProfileSummary.js";

function HomePage({ accessToken, socket, tab, setTab }) {
  const [jokes, setJokes] = useState([]);
  const [offset, setOffset] = useState(10);
  const [sortType, setSortType] = useState("latest");
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async (type) => {
    setIsLoading(true)
    try {
      const requestURL = `https://laugher-server.onrender.com/joke/${tab}/${type}/0`;

      const result = await authorizedGetRequest(requestURL, accessToken);
      if (result.data !== null) {
        const updatedJokes = result.data.data.map((joke) => ({
          ...joke,
          commentsToggle: false,
          offset: 0,
        }));
        setJokes(updatedJokes);
      }
    } catch (error) {
      console.error(error);
    }
    finally{
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchData(sortType);
  }, [tab, sortType]);

  let scrollableElement = document.getElementById("index-page");
  const getMoreJokes = async () => {
    setIsLoading(true)
    const isNearBottom = scrollableElement.scrollTop + scrollableElement.clientHeight >= scrollableElement.scrollHeight - 1;
    if(isNearBottom){
      const requestURL = `/joke/${tab}/${sortType}/${offset}`;
      const result = await authorizedGetRequest(requestURL, accessToken);
      if (result.data !== null) {
        if (result.data.data.length === 0) {
          return;
        }
        setJokes((prevJokes) => prevJokes.concat(result.data.data));
        setOffset((prevOffset) => prevOffset + 10);
      }
    }
    setIsLoading(false)
  };

  useEffect(() => {
    if (scrollableElement !== null) {
      scrollableElement.addEventListener("scrollend", getMoreJokes);
      return () => {
        scrollableElement.removeEventListener("scrollend", getMoreJokes);
      };
    }
  }, [scrollableElement, getMoreJokes, sortType]);

  return (
    <section id="home-section">
      {typeof tab === "number" ? (
        <>
          <ProfileSummary accessToken={accessToken} userId={tab} />
          <JokeContainer accessToken={accessToken} socket={socket} setTab={setTab} jokeList={jokes || []} setJokes={setJokes} />
        </>
      ) : (
        <>
          <JokeForm accessToken={accessToken} jokes={jokes} setJokes={setJokes} />
          <div id="sort-form">
            <hr id="left-line" />
            <select onChange={(e) => setSortType(e.target.value)}>
              <option value="latest">Latest</option>
              <option value="most-popular">Most popular</option>
            </select>
            <hr id="right-line" />
          </div>
          <JokeContainer accessToken={accessToken} socket={socket} setTab={setTab} jokeList={jokes || []} setJokes={setJokes} />
        </>
      )}
      {isLoading ? <img className="loading" src="loading.gif" alt=""/> : ""}
    </section>
  );
}

export default HomePage;

