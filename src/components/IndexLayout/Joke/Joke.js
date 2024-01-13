import { useState } from "react";
import "./joke.scss";
import {
  BiDotsHorizontalRounded,
  BiCommentDetail,
} from "react-icons/bi";
import {
  FaTrashAlt,
  FaPencilAlt,
  FaCheck,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import CommentForm from "../../CommentForm/CommentForm";
import CommentList from "./CommentList/CommentList";
import ReactionsView from "../../ReactionsView/ReactionsView";
import {
  authorizedDeleteRequest,
  authorizedGetRequest,
  authorizedPostRequest
} from "../../../utils/authorizedRequest.js";
import { dateTimeFormat } from "../../../utils/dataFormats.js";

function Joke({accessToken, socket, joke, setJokes, jokes }) {
  const [volume, setVolume] = useState(joke.reaction_value);
  const [submitionToggle, setSubmitionToggle] = useState(!!joke.reaction_value);
  const [comments, setComments] = useState([]);
  const [commentsToggle, setCommentsToggle] = useState(false);
  const [commentCounter, setCommentCounter] = useState(joke.comment_counter);
  const [reactions, setReactions] = useState([]);
  const [editDescription, setEditDescription] = useState(joke.description);
  const [editToggle, setEditToggle] = useState(false);

  function addReaction(jokeId) {
    async function postData() {
      const payload = {
        jokeId: jokeId,
        reactionValue: volume,
        author_id: joke.author_id
      };
      try {
        const { data, err } = await authorizedPostRequest(
          "https://laugher-server.onrender.com/reaction/add",
          payload,
          {},
          accessToken
        );
        if (data != null) {
          joke.reaction_counter = joke.reaction_counter + 1;
          setSubmitionToggle(true);
          socket.emit("notification", joke.author_id)
        } else {
          console.error(err, data);
        }
      } catch (error) {
        console.error(error);
      }
    }
    postData();
  }

  function getComments(jokeId, offset) {
    const fetchData = async () => {
      try {
        const result = await authorizedGetRequest(
          `https://laugher-server.onrender.com/comment/all/${jokeId}/${offset}`,
          accessToken
        );
        if (result.data != null) {
          if (offset === 0) {
            setComments(result.data);
            setCommentsToggle(true);
          } else {
            setComments(comments.concat(result.data));
            setCommentsToggle(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }

  function getGradeEmoji() {
    const sum = Number(joke.reactions_sum);
    const count = joke.reaction_counter;
    const average = count > 0 ? Math.round(sum / count) : 0;
    console.log("Average: ", average, "sum", sum, "count", count, "joke", joke)
    switch (average) {
      case 0:
        return "😶";
      case 1:
        return "😐";
      case 2:
        return "😕";
      case 3:
        return "😄";
      case 4:
        return "😂";
      case 5:
        return "🤣";
      default:
        return "";
    }
  }

  function getReactions(jokeId) {
    const fetchData = async () => {
      try {
        const result = await authorizedGetRequest(`https://laugher-server.onrender.com/reaction/joke/${jokeId}`, accessToken);
        if (result.data != null) {
          setReactions(result.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }

  const username = window.localStorage.getItem("username");
  const isOwner = joke.username === username;
  const [jokeOptionToggle, setJokeOptionToggle] = useState(false);

  async function deleteJoke(jokeId) {
    const { data } = await authorizedDeleteRequest(
      `https://laugher-server.onrender.com/joke/delete/${jokeId}`,
      accessToken
    );
    if (data != null) {
      setJokes(jokes.filter((jokeItem) => jokeItem.id !== jokeId));
    }
  }

  async function editJoke(jokeId) {
    const { data } = await authorizedPostRequest(
      `https://laugher-server.onrender.com/joke/edit/${jokeId}`,
      {
        description: editDescription,
      },
      {},
      accessToken
    );
    if (data != null) {
      const jokeIndex = jokes.indexOf(jokes.find((item) => item.id === jokeId));
      jokes[jokeIndex].description = editDescription;
      setJokes(jokes);
      setEditToggle(false);
    }
  }

  return (
    <div id="joke">
      {reactions.length > 0 ? (
        <ReactionsView reactions={reactions} setReactions={setReactions} />
      ) : (
        ""
      )}
      <div id="joke-header">
        <div onClick={() => window.location = `/user/${joke.author_id}`}>
          <img id="joke-profile-picture" src={process.env.PUBLIC_URL + "/default_profile.png"} alt="" />
          <h4 id="joke-username">{joke.username}</h4>
        </div>

        <section id="options-container">
          {jokeOptionToggle ? (
            <div id="joke-options">
              <div onClick={() => setEditToggle(joke.id)} id="joke-option-edit">
                <FaPencilAlt />
                Edit
              </div>
              <div onClick={() => deleteJoke(joke.id)} id="joke-option-delete">
                <FaTrashAlt />
                Delete
              </div>
            </div>
          ) : (
            ""
          )}
          {isOwner ? (
            <BiDotsHorizontalRounded
              onClick={() => setJokeOptionToggle(!jokeOptionToggle)}
              size="20px"
            />
          ) : (
            ""
          )}
        </section>
      </div>
      <div id="description-container">
        {editToggle ? (
          <div id="edit-joke-container">
            <input
              id="edit-desc"
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div id="action-btns">
              <FaCheck onClick={() => editJoke(joke.id)} />
              <IoMdClose
                onClick={() => setEditToggle(false)}
                id="close-btn"
              />
            </div>
          </div>
        ) : (
          joke.description
        )}
      </div>
      <div id="media-container">
        {joke.photo_url === null && joke.audio !== null ? <audio src={joke.audio} controls></audio> : ""}
        {joke.photo_url !== null ? <img src={joke.photo_url} alt="joke" /> : ""}
      </div>
      <form id="reaction-form">
        <input
          disabled={submitionToggle}
          onTouchEnd={() => addReaction(joke.id)}
          onClick={() => addReaction(joke.id)}
          type="range"
          step="0.01"
          min="1"
          max="5"
          value={volume ? volume : 1}
          onChange={(e) => setVolume(e.target.value)}
          id="reaction-slider"
        />
      </form>
      <CommentForm
        item={{ parrent_comment_id: null }}
        commentCounter={commentCounter}
        setCommentCounter={setCommentCounter}
        setComments={setComments}
        joke={joke}
        comments={comments}
        accessToken
      />
      <div id="joke-statistics">
        {commentCounter > 0 ? (
          <>
            <BiCommentDetail
              size="24px"
              id="show-comments"
              className={joke.comment_counter > 0 ? "" : "hidden"}
              onClick={() => getComments(joke.id, 0)}
            />
            <span>{commentCounter}</span>
          </>
        ) : (
          ""
        )}
        <p
          onClick={() => getReactions(joke.id)}
          id="reaction-statistics"
        >
          {getGradeEmoji()}
          {joke.reaction_counter}
        </p>
      </div>
      <div id="time-container">
        <p id="time"> {dateTimeFormat(joke.publish_time)} </p>
      </div>

      {!commentsToggle ? "" : (
        <CommentList
          getComments={getComments}
          setComments={setComments}
          onToggle={() => setCommentsToggle(!commentsToggle)}
          comments={comments}
          joke={joke}
          accessToken={accessToken}
        />
      )}
    </div>
  );
}

export default Joke;
