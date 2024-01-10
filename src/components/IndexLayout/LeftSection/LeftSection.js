import Navbar from "../../Navbar/Navbar"
import ProfileSummary from "../../ProfileSummary/ProfileSummary"
import Suggestions from "../../Suggestions/Suggestions"

import "./left_section.scss"



function LeftSection({setTab}) {
    return <section id="left-section">
        <div id="inner-left-section">
            <ProfileSummary/>
            <Navbar setTab={setTab}/>
            <Suggestions/>
        </div>

    </section>
}

export default LeftSection