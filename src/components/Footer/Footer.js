import "./footer.scss"
import {AiFillHome, AiFillMessage} from "react-icons/ai"
import {BiWorld} from "react-icons/bi"
import { FaArrowAltCircleUp } from "react-icons/fa";
import { clickTab, goToTop } from "../../utils/animations.js";

function Footer({ setTab }) {

    return <footer>
        <AiFillHome onClick={()=>clickTab("home", setTab)}/>
        <BiWorld onClick={()=>clickTab("public", setTab)}/>
        <FaArrowAltCircleUp onClick={()=>goToTop()}/>
        <img src={process.env.PUBLIC_URL + "/default_profile.png"} alt="" onClick={()=>clickTab("profile", setTab)}/>
        <AiFillMessage onClick={()=>clickTab("messenger", setTab)}/>
    </footer>
}

export default Footer