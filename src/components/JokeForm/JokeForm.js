import "./joke_form.scss"
import { IoMdPhotos } from "react-icons/io"
import { FaMicrophone } from "react-icons/fa"
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { useEffect, useState } from "react";
import { BsStopFill, BsFillTrashFill } from "react-icons/bs";
import { authorizedPostRequest } from "../../utils/authorizedRequest";
import { IoIosSend } from "react-icons/io";


function JokeForm({accessToken, jokes, setJokes}){
    const username = window.localStorage.getItem("username")
    const profilePhoto = window.localStorage.getItem("profilePhoto")
    let [uploading, setUploading] = useState(false)

    const {
        startRecording,
        stopRecording,
        recordingBlob,
        isRecording,
        recordingTime
    } = useAudioRecorder();
    let [blob, setBlob] = useState(recordingBlob)
    const [audioUrl, setAudioUrl] = useState(undefined)

    function playAudio() {
        const audio = URL.createObjectURL(recordingBlob)
        setAudioUrl(audio)
    }

    function discardAudio() {
        setBlob(undefined)
        setAudioUrl(undefined)
    }

    function discardJoke() {
        setBlob(undefined)
        setDescription("")
        setPhoto(null)
    }

    function finishRecording() {
        stopRecording()
    }

    useEffect(() => {
        if (!recordingBlob) { return }
        setBlob(recordingBlob)
    }, [recordingBlob])

    const jokeData = new FormData()
    const [description, setDescription] = useState("")
    const [photo, setPhoto] = useState(null)

    function uploadJoke() {

        jokeData.set("description", description)
        jokeData.set("file", photo || blob)
        jokeData.set("isPublic", true)
        jokeData.set("battle", null)

        async function postData(){
            setUploading(true)
            const {data, err} = await authorizedPostRequest("https://laugher-server.onrender.com/joke/create", jokeData, {
                "Content-Type": "multipart/form-data"
            }, accessToken)
            if(data != null){
                const newElement = {
                    audio: blob,
                    comment_counter: 0,
                    description: description,
                    id: data.id,
                    offset: 0,
                    photo_url: data.photo_url,
                    audio: data.audio,
                    profile_picture_url: null,
                    publish_time: "now",
                    reaction_author_id: null,
                    reaction_counter: 0,
                    reaction_value: 0,
                    reactions_sum: 0,
                    username: username
                }
                setJokes([newElement, ...jokes])
                discardJoke()
                setUploading(false)
            }else{
                console.log(err, data)
            }
        }
        postData()

    
    }
    return <div id="joke-form">
        <div id="enters-container">
            <div className="input-container">
                <span>
                    <img src={profilePhoto != "null" ? profilePhoto : "default_profile.png"} />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Share your humor with us">
                    </textarea>
                </span>


                <span id="joke-btn-span">
                    {isRecording || uploading ? <img className="loading" src="loading.gif" alt=""/> : <button  onClick={() => { uploadJoke() }} id="upload-btn"><IoIosSend size="25px"/></button>}
                    <button onClick={() => { discardJoke() }} id="discard-btn"><b>X</b></button>
                </span>

            </div>

            <div id="media-btns-container">
                <label htmlFor="photo-upload-btn"
                    className={!blob ? "styled-photo-upload" : "styled-photo-upload disabled"}>
                    <IoMdPhotos size="20px" />
                </label>

                {
                    !blob ?
                        <input
                            onChange={(e) => setPhoto(e.target.files[0])}
                            id="photo-upload-btn"
                            name="photo-upload-btn"
                            type="file"></input>
                        :
                        ""
                }
                {
                    isRecording ?
                        <div
                            id="audio-player"
                            className="audio-container">
                            <p
                                id="audio-timer">{recordingTime}s
                            </p>
                            <BsStopFill
                                onClick={() => { finishRecording() }}
                                id="stop-audio-btn"
                            />
                        </div>
                        :
                        <>{
                            blob ?
                                <div className="audio-container">
                                    <audio
                                        controls
                                        src={audioUrl}
                                        onPlay={() => playAudio()}>
                                    </audio>

                                    <BsFillTrashFill
                                        onClick={() => discardAudio()}
                                        id="audio-trash"
                                        size="20px"
                                    />
                                </div>
                                :
                                <label
                                    for="audio-input-btn"
                                    className={!photo ? "styled-audio-input" : "styled-audio-input disabled"}>
                                    {<FaMicrophone
                                        size="20px"
                                        onClick={!photo ? () => startRecording() : () => { return }} />
                                    }
                                </label>
                        }

                        </>
                }
                <input
                    type="hidden"
                    id="audio-input-btn" />
            </div>

        </div>
        <div id="final-buttons">


        </div>
    </div>
}


export default JokeForm