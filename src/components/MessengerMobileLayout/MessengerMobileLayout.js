import Header from "../Header/Header.js"
import LeftSection from "../IndexLayout/LeftSection/LeftSection.js"
import Messenger from "../IndexLayout/Messanger/Messenger.js"
import Footer from "../Footer/Footer.js"
import "./messenger_mobile_layout.scss"


function MessengerMobileLayout({accessToken, socket, tab, setTab}) {

    return <>
        <Header accessToken={accessToken} socket={socket}/>
        <main id="index-page">
            <LeftSection accessToken={accessToken} setTab={setTab}/>
            <Messenger accessToken={accessToken} socket={socket} setTab={setTab}/>
        </main>
        <Footer tab={tab} setTab={setTab}/>
    </>
    

}

export default MessengerMobileLayout