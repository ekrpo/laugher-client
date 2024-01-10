import Header from "../Header/Header"
import LeftSection from "./LeftSection/LeftSection"
import Home from "./Home/Home.js"
import Messenger from "../IndexLayout/Messanger/Messenger.js"
import Footer from "../Footer/Footer.js"
import "./index_layout.scss"
import { useState } from "react"

function IndexLayout({socket, tab, setTab}) {
    const [screenWidth] = useState(window.innerWidth)
    return <>
        <Header socket={socket}/>
        <main id="index-page">
            <LeftSection setTab={setTab}/>
            <Home socket={socket} tab={tab} setTab={setTab}/>
            {screenWidth > 1024 ? <Messenger socket={socket} setTab={setTab}/> : ""}
        </main>
        <Footer tab={tab} setTab={setTab}/>
    </>
    

}

export default IndexLayout