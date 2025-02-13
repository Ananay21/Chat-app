import { useEffect, useState } from "react";
import { Navigate, Route,Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { useAuthStore } from "./store/useAuthStore";
import {Toaster} from "react-hot-toast";
import { Loader } from "lucide-react";

const App=()=>{
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();

  console.log(onlineUsers);

  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  if(isCheckingAuth && !authUser){
    return (
          <div className="flex items-center justify-center h-screen">
            <Loader className="size-10 animate-spin"/>
          </div>
    );
  }

  return   <div>
              <NavBar/>
              <Routes>
                <Route path="/" element={authUser?<HomePage/>:<Navigate to="/login"/>}/>
                <Route path="/login" element={!authUser?<Login/>:<Navigate to="/"/>}/>
                <Route path="/signup" element={!authUser?<Signup/>:<Navigate to="/"/>}/>
                <Route path="/profile" element={authUser?<Profile/>:<Navigate to="/login"/>}/>
                <Route path="/settings" element={<Settings/>}/>
              </Routes>
              <Toaster/>
           </div>
}

export default App;