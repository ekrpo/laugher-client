import Header from "../Header/Header"
import Messenger from "../IndexLayout/Messanger/Messenger"
import Footer from "../Footer/Footer.js"
import "./index_layout.scss"
import { useState } from "react"
import Profile from "../Profile/Profile.js"
import LeftSection from "../IndexLayout/LeftSection/LeftSection.js"


function ProfileLayout({socket, tab, setTab}) {
    return <>
        <Header socket={socket}/>
        <main id="index-page">
            <LeftSection setTab={setTab}/>
            <Profile userId={tab} setTab={setTab}/>
            <Messenger socket={socket} setTab={setTab}/>
        </main>
        <Footer tab={tab} setTab={setTab}/>
    </>
    

}

export default ProfileLayout