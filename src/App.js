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





function App() {
  const [tab, setTab] = useState("home")

  function getFinishTime() {
    return Number(window.localStorage.getItem("finishTime"));
  }
  
  function setFinishTime() {
    window.localStorage.setItem("finishTime", Date.now() + 100000);
  }
  
  const [accessToken, setAccessToken] = useState(window.localStorage.getItem("accessToken"))
  const [refreshTokenValue, setRefreshTokenValue] = useState(window.localStorage.getItem("refreshToken"))
  
  async function refreshToken() {
    setFinishTime();
  
    const headers = {
      refreshToken: refreshTokenValue
    }
    const config = {
      headers: headers
    }
    axios.get("https://laugher-server.onrender.com/auth/refresh-token", config)
    .then(result=>{
      console.log(result)
      window.localStorage.setItem("accessToken", result.data.accessToken)
      window.localStorage.setItem("refreshToken", result.data.refreshToken)
      setAccessToken(result.data.accessToken)
      setRefreshTokenValue(result.data.refreshToken)
    })
    .catch(err=>{
      console.log("Auth error: ", err)
      logOut()
    })
  
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
          <Route path="/user/:userId"  element={<ProfileLayout accessToken={accessToken} socket={socket} tab={tab} setTab={setTab} />}/>
          <Route path="/public"  element={<IndexLayout socket={socket} accessToken={accessToken} tab="public" setTab={setTab} />}/>
          <Route path="/messenger"  element={<MessengerMobileLayout accessToken={accessToken} socket={socket} tab="messenger" setTab={setTab} />}/>
          <Route path="/"  element={<IndexLayout socket={socket} accessToken={accessToken} tab={"home"} setTab={setTab} />}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
