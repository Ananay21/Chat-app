import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:3000":"/";

export const useAuthStore=create((set,get)=>(
    {
        authUser:null,
        isSigningUp:false,
        isLoggingIn:false,
        isUpdatingProfile:false,
        isCheckingAuth:true,
        onlineUsers:[],
        socket:null,

        checkAuth:async()=>{
            try {
                const response=await axiosInstance.get("/auth/check");
                set({authUser:response.data});

                get().connectSocket();
            } catch (error) {
                console.log(`error in check Auth: ${error.response.data.message}`);
                set({authUser:null});   
            }finally{
                set({isCheckingAuth:false});
            }
        },

        signUp:async(data)=>{
            set({isSigningUp:true});
            try {
                const response=await axiosInstance.post("/auth/signup",data);
                set({authUser:response.data});
                toast.success("Account created successfully!");

                get().connectSocket();
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
            }finally{
                set({isSigningUp:false});
            }
        },

        logOut:async()=>{
            try {
                await axiosInstance.post("/auth/logout");
                set({authUser:null});
                toast.success("Logged out successfully!");

                get().disconnectSocket();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        },

        logIn:async(data)=>{
            set({isLoggingIn:true});
            try{
                const response=await axiosInstance.post("/auth/login",data);
                set({authUser:response.data});
                toast.success("Logged in successfully!");

                get().connectSocket();  
            }catch(error){
                console.log(error);
                toast.error(error.response.data.message);
            }finally{
                set({isLoggingIn:false});
            }

        },

        updateProfile:async(data)=>{
            set({isUpdatingProfile:true});
            try{
                const response=await axiosInstance.put("/auth/update",data);
                set({authUser:response.data});
                console.log(response.data);
                toast.success("Profile uploaded successfully");
            }catch(error){
                console.log(error);
                toast.error(error.response.data.message);
            }finally{
                set({isUpdatingProfile:false});
            }
        },

        connectSocket:()=>{
            const {authUser}=get();
            if(!authUser||get().socket?.connected) return;

            const socket=io(BASE_URL,{query:{userID:authUser._id}});
            
            socket.connect();
        
            set({socket:socket});

            socket.on("getOnlineUsers",(userIDs)=>{
                set({onlineUsers:userIDs});
            });
        },
        
        disconnectSocket:()=>{
            if(get().socket?.connected) get().socket.disconnect();
        }
    }
));