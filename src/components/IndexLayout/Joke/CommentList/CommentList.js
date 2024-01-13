import Comment from "../Comment/Comment";
import { useState } from "react";
import "./comment_list.scss"



function CommentList({accessToken, getComments, setComments ,onToggle, comments, joke}){

    const [offset, setOffset] = useState(0)
    const haveIMoreComments = joke.comment_counter - (offset + 10) > 0
    {console.log(joke)}
    return <div id="comments">
    {comments.map(item=>{
        return <Comment accessToken={accessToken} key={item.id} item={item} comments={comments} joke={joke}/>
    })}
    <div id="comments-controller-container">
        {haveIMoreComments ? <p id="more-comments" onClick={()=>{setOffset(offset + 10);getComments(joke.id, offset)}}>Show more</p>:""}
        <p id="hide-comments" onClick={()=>{onToggle();setOffset(0);setComments([])}}>Hide comments</p>
    </div>

</div>
}

export default CommentList