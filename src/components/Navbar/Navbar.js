import "./navbar.scss"
import { FaHome, FaArrowUp } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { LuSwords } from "react-icons/lu";
import { IoIosPhotos } from "react-icons/io";
import {goToTop, clickTab} from "../../utils/animations.js"


function Navbar({setTab}){
    const urlSplit = document.URL.split("/")
    const clickedTab = urlSplit[urlSplit.length - 1]

    return <nav id="navbar">
        <div onClick={()=>clickTab("home", setTab)} id="home" className={clickedTab==="" ? "navbar-item clicked":"navbar-item"}>
         <FaHome/>
            <h3>Home</h3>

        </div>
        <div onClick={()=>clickTab("public", setTab)} id="public" className={clickedTab==="public" ? "navbar-item clicked":"navbar-item"}>
            <BiWorld/>
            <h3>Public</h3>

        </div>
        <div id="my-battles" className="navbar-item">
            <LuSwords/>
            <h3>My Battles</h3>

        </div>
        <div onClick={()=>clickTab("profile", setTab)} id="profile" className={clickedTab==="profile" || typeof(clickedTab)=="number" ? "navbar-item clicked":"navbar-item"}>
            <IoIosPhotos/>
            <h3>My Posts</h3>

        </div>
        <div onClick={()=>goToTop()} id="go-up" className="navbar-item">
            <FaArrowUp/>
            <h3>Go up</h3>

        </div>
    </nav>
}

export default Navbar