import Header from "../Header/Header.js"
import LeftSection from "../IndexLayout/LeftSection/LeftSection.js"
import Messenger from "../IndexLayout/Messanger/Messenger.js"
import Footer from "../Footer/Footer.js"
import "./messenger_mobile_layout.scss"


function MessengerMobileLayout({socket, tab, setTab}) {

    return <>
        <Header socket={socket}/>
        <main id="index-page">
            <LeftSection setTab={setTab}/>
            <Messenger socket={socket} setTab={setTab}/>
        </main>
        <Footer tab={tab} setTab={setTab}/>
    </>
    

}

export default MessengerMobileLayout