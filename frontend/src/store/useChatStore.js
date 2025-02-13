import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Socket } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useChatStore=create((set,get)=>(
    {
        messages:[],
        users:[],
        selectedUser:null,

        isUsersLoading:false,
        isMessagesLoading:false,

        getUsers:async ()=>{
            set({isUsersLoading:true});
            try {
                const response= await axiosInstance.get("/messages/users");
                set({users:response.data});
            } catch (error) {
                console.log("error in getting users due to :",error);
                toast.error(error.response.data.message);
            }finally{
                set({isUsersLoading:false});
            }
        },

        getMessages:async(id)=>{
            set({isMessagesLoading:true});
            try {
                const reqURL=`/messages/${id}`;
                const response=await axiosInstance.get(reqURL);
                set({messages:response.data.messages});
            } catch (error) {
                console.log("error loading messages due to: ",error);
                toast.error(error.response.data.message);
            }finally{
                set({isMessagesLoading:false});
            }
        },

        sendMessage: async (messageData) => {
            const { selectedUser, messages } = get();
            try {
              const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
              if(messages.length===0){
                set({messages:[res.data]});
              }
              else{
                set({messages:[...messages,res.data]});
              }
              console.log(messages);
            } catch (error) {
              toast.error(error.message);
            }
          },
        // optimize later
        setSelectedUser:(user)=>{set({selectedUser:user})},

        subscribeToMessages:()=>{
            const {selectedUser}=get();
            if(!selectedUser) return;

            const socket=useAuthStore.getState().socket;
            


            socket.on("newMessage",(newMessage)=>{
                if(newMessage.senderID!==selectedUser._id) return;
                set({messages:[...get().messages,newMessage]});
            });
        },

        unsubscribeFromMessages:()=>{
            const socket=useAuthStore.getState().socket;
            socket.off("newMessage");
        }
    }
))