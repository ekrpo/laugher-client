import Header from "../Header/Header"
import Messenger from "../IndexLayout/Messanger/Messenger"
import Footer from "../Footer/Footer.js"
import "./index_layout.scss"
import { useState } from "react"
import Profile from "../Profile/Profile.js"
import LeftSection from "../IndexLayout/LeftSection/LeftSection.js"


function ProfileLayout({accessToken ,socket, tab, setTab}) {
    return <>
        <Header accessToken={accessToken} socket={socket}/>
        <main id="index-page">
            <LeftSection accessToken={accessToken} setTab={setTab}/>
            <Profile accessToken={accessToken} userId={tab} setTab={setTab}/>
            <Messenger accessToken={accessToken} socket={socket} setTab={setTab}/>
        </main>
        <Footer tab={tab} setTab={setTab}/>
    </>
    

}

export default ProfileLayout