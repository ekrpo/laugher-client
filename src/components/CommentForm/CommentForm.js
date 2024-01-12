import {BsSendFill} from "react-icons/bs"
import { useState } from "react"
import "./comment_form.scss"
import { authorizedPostRequest } from "../../utils/authorizedRequest"

function CommentForm({item, commentCounter, setCommentCounter, setComments, joke, comments }){

    const [comment, setComment ] = useState("")
    function postComment(jokeId, parrentCommentId, e){
        console.log(e)
        e.preventDefault()
        if(comment.trim().length === 0){
            return
        }
        setComment("")
        const payload = {
            jokeId: jokeId,
            parrentCommentId: parrentCommentId,
            content: comment,
            audio: null,
            authorId: joke.author_id
        }
        async function postData(){
            const {data, err} = await authorizedPostRequest("https://laugher-server.onrender.com/comment/add", payload, {})
            if(data != null){
                item.replies += 1
                setCommentCounter(commentCounter + 1)
                setComments([...comments, {
                    id: data.id,
                    content: comment,
                    username: "edin.ba_",
                    replies: 0,
                    reaction_counter: 0,
                    parrentCommentId: parrentCommentId
                }])
            }else{
                console.log(err, data)
            }
        }
        postData()
    }


    return <form id="comment-form">
        <textarea placeholder="You can let comment here" value={comment} onChange={(e)=>setComment(e.target.value)}></textarea>
        <button onClick={(e)=>postComment(joke.id, item.id || null, e)}><BsSendFill/></button>
    </form>
}

export default CommentForm