import Header from "../Header/Header"
import LeftSection from "./LeftSection/LeftSection"
import Home from "./Home/Home.js"
import Messenger from "../IndexLayout/Messanger/Messenger.js"
import Footer from "../Footer/Footer.js"
import "./index_layout.scss"
import { useState } from "react"

function IndexLayout({accessToken, socket, tab, setTab}) {
    const [screenWidth] = useState(window.innerWidth)
    return <>
        <Header accessToken={accessToken} socket={socket}/>
        <main id="index-page">
            <LeftSection accessToken={accessToken} setTab={setTab}/>
            <Home accessToken={accessToken} socket={socket} tab={tab} setTab={setTab}/>
            {screenWidth > 1024 ? <Messenger accessToken={accessToken} socket={socket} setTab={setTab}/> : ""}
        </main>
        <Footer tab={tab} setTab={setTab}/>
    </>
    

}

export default IndexLayout