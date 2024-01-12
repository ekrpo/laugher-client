import { BiCommentDetail } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { useState } from "react";
import CommentList from "../CommentList/CommentList";
import "./comment.scss";
import CommentForm from "../../../CommentForm/CommentForm";
import { authorizedGetRequest, authorizedPutRequest } from "../../../../utils/authorizedRequest";
import { dateTimeFormat } from "../../../../utils/dataFormats.js";

function Comment({ item, joke }) {
  const [repliesToggle, setRepliesToggle] = useState(false);
  const [commentReplies, setCommentReplies] = useState([]);
  const [commentCounter, setCommentCounter] = useState(item.replies);
  const [likeToggle, setLikeToggle] = useState(item.user_id !== null);

  async function getCommentReplies(clickedComment) {
    try {
      const result = await authorizedGetRequest(`/comment/replies/${clickedComment.id}/offset/${0}`);
      if (result.data !== null) {
        setCommentReplies(result.data);
        setRepliesToggle(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function likeUnlikeComment(commentId, action) {
    const endpoint = action === "like" ? `/comment/like/${item.author_id}/` : "/comment/unlike/";
    const { data, err } = await authorizedPutRequest(`${endpoint}${commentId}`);

    if (data !== null) {
      item.reaction_counter += action === "like" ? 1 : -1;
      setLikeToggle(action === "like");
    } else {
      console.error(err);
    }
  }

  return (
    <div className={item.parrent_comment_id ? "reply" : ""} key={item.id} id="comment-container">
      <div id="comment-content-container">
        <div id="author-info">
          <img id="comment-profile-photo" src={item.profile_picture_url || "default_profile.png"} alt="." />
          <h4 id="comment-authorname">{item.username}</h4>
        </div>
        <div id="comment-text">{item.content}</div>
        <div id="comment-interactions">
          <CommentForm item={item} setCommentCounter={setCommentCounter} commentCounter={commentCounter} setComments={setCommentReplies} joke={joke} comments={commentReplies} />
          <div id="interactions-container">
            <div id="comment-statistic">
              {item.replies > 0 ? (
                <>
                  <BiCommentDetail onClick={() => getCommentReplies(item)} size="24px" />
                  <p id="replies-counter">{commentCounter}</p>
                </>
              ) : (
                <>
                  <BiCommentDetail style={{ opacity: 0 }} onClick={() => getCommentReplies(item)} size="24px" />
                  <p style={{ opacity: 0 }} id="replies-counter">
                    {commentCounter}
                  </p>
                </>
              )}
            </div>
            <div id="like-container">
              {likeToggle ? (
                <AiFillHeart className="liked-comment" onClick={() => likeUnlikeComment(item.id, "unlike")} size="24px" />
              ) : (
                <AiFillHeart onClick={() => likeUnlikeComment(item.id, "like")} size="16pt" />
              )}
              <span>{item.reaction_counter}</span>
            </div>
          </div>
        </div>
        <span id="comment-time">{dateTimeFormat(item.comment_time)}</span>
      </div>
      {repliesToggle ? <CommentList className="replies" getComments={getCommentReplies} comments={commentReplies} setComments={setCommentReplies} onToggle={() => setRepliesToggle(!repliesToggle)} joke={item} /> : ""}
    </div>
  );
}

export default Comment;