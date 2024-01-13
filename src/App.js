import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import AuthLayout from "./components/AuthLayout/AuthLayout.js"
import SignUp from './components/SignUp/SignUp';
import SignIn from './components/SignIn/SignIn';
import EmailVerification from './components/EmailVerification/EmailVerification';
import IndexLayout from './components/IndexLayout/IndexLayout';
import ProfileLayout from './components/ProfileLayout/ProfileLayout.js';
import { useEffect, useState } from 'react';
import MessengerMobileLayout from './components/MessengerMobileLayout/MessengerMobileLayout.js';
import axios from 'axios';
import socket from "./config/socket.js";
import { logOut } from './components/ProfileOptions/ProfileOptions.js';

function getFinishTime() {
  return Number(window.localStorage.getItem("finishTime"));
}

function setFinishTime() {
  window.localStorage.setItem("finishTime", Date.now() + 100000);
}

async function refreshToken() {
  setFinishTime();
  try {
    const headers = {
      accessToken: window.localStorage.getItem("accessToken"),
      refreshToken: window.localStorage.getItem("refreshToken")
    }
    const config = {
      headers: headers
    }
    const result = await axios.get("/auth/refresh-token", config);
    window.localStorage.setItem("accessToken", result.headers.get("accessToken"))
    window.localStorage.setItem("refreshToken", result.headers.get("refreshToken"))
  } catch (error) {
    console.log("Auth error: ", error)
    await logOut()
  }
}

function getRemainingTime() {
  return getFinishTime() - Date.now();
}


const useAuthentication = () => {
  useEffect(() => {
    let refreshTimeout;

    const scheduleRefresh = () => {
      // Clear any existing timeout
      clearTimeout(refreshTimeout);

      const remainingTime = getRemainingTime();

      if (remainingTime <= 0) {
        console.log("Token expired, refreshing now");
        refreshToken();
      } else {
        console.log("Scheduling refresh in", remainingTime / 1000, "seconds");
        refreshTimeout = setTimeout(() => {
          refreshToken();
          scheduleRefresh(); // Schedule the next refresh
        }, remainingTime - 5000); // Refresh 5 seconds before token expiration
      }
    };

    // Initial call to start the mechanism
    scheduleRefresh();

    // Clean up the timeout on component unmount
    return () => {
      clearTimeout(refreshTimeout);
    };
  }, []); // Empty dependency array ensures it runs only once on mount
};



function App() {
  const [tab, setTab] = useState("home")
  
  const id = window.localStorage.getItem("id");
  socket.on("connection", () => {
    console.log("Welcome to the server");
  });

  socket.emit("connected", Number(id));
  useAuthentication();
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/auth/signup" element={<AuthLayout socket={socket} tab={tab} setTab={setTab} children={<SignUp/>}/>}/>
          <Route path="/auth/signin" element={<AuthLayout socket={socket} tab={tab} setTab={setTab}  children={<SignIn  />}/>}/>
          <Route path="/auth/email-verification" element={<AuthLayout socket={socket} tab={tab} setTab={setTab}  children={<EmailVerification />}/>}/>
          <Route path="/user/:userId" element={<ProfileLayout socket={socket} tab={tab} setTab={setTab} />}/>
          <Route path="/public" element={<IndexLayout socket={socket} tab="public" setTab={setTab} />}/>
          <Route path="/messenger" element={<MessengerMobileLayout socket={socket} tab="messenger" setTab={setTab} />}/>
          <Route path="/" element={<IndexLayout socket={socket} tab={"home"} setTab={setTab} />}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
