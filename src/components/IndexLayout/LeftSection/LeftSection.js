import Navbar from "../../Navbar/Navbar"
import ProfileSummary from "../../ProfileSummary/ProfileSummary"
import Suggestions from "../../Suggestions/Suggestions"

import "./left_section.scss"



function LeftSection({accessToken, setTab}) {
    return <section id="left-section">
        <div id="inner-left-section">
            <ProfileSummary accessToken={accessToken}/>
            <Navbar accessToken={accessToken} setTab={setTab}/>
            <Suggestions accessToken={accessToken}/>
        </div>

    </section>
}

export default LeftSection