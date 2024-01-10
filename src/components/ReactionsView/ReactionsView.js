import React from "react";
import FollowButton from "../Utils/FollowButton.js";
import "./reactions_view.scss";

function ReactionsView({ reactions, setReactions }) {
  function closeReactionsView() {
    setReactions([]);
  }

  function getEmoji(value) {
    value = Math.round(value);
    let emoji = "";
    switch (value) {
      case 1:
        emoji = "😐";
        break;
      case 2:
        emoji = "😕";
        break;
      case 3:
        emoji = "😄";
        break;
      case 4:
        emoji = "😂";
        break;
      case 5:
        emoji = "🤣";
        break;
      default:
        break;
    }
    return emoji;
  }

  return (
    <div id="reactions-view">
      <div id="reactions-header">
        <h3>Reactions</h3>
        <h3 id="close-btn" onClick={closeReactionsView}>
          X
        </h3>
      </div>
      <hr />
      <div id="reactions-container">
        {reactions.map((reaction) => {
          const reactionPercentage = (reaction.value / 5.0) * 100;

          return (
            <div className="single-reaction" key={reaction.id}>
              <div id="reaction-user-info">
                <img
                  src={
                    reaction.profile_picture_url
                      ? reaction.profile_picture_url
                      : "default_profile.png"
                  }
                  alt=""
                />
                <h4>{reaction.username}</h4>
              </div>
              <div id="reaction-values">
                <div id="reaction-value-container">
                  <div
                    style={{ width: `${reactionPercentage}%` }}
                    id="reaction-value"
                  ></div>
                </div>
                <p>{getEmoji(reaction.value)}</p>
              </div>
              <FollowButton userId={reaction.userid} followId={reaction.receiver_id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReactionsView;
