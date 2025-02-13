import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import SideBarSkeleton from "./SideBarSkeleton.jsx";
import {Users } from "lucide-react";
import pfp from "../assets/pfp.jpg";
import { useAuthStore } from "../store/useAuthStore.js";

const SideBar=()=>{
    const {getUsers,users,selectedUser,setSelectedUser,isUsersLoading}=useChatStore();
    const {onlineUsers}=useAuthStore();
    const [showOnlineOnly,setShowOnlineOnly]=new useState(false);

    useEffect(()=>{getUsers()},[]);

    const filteredUsers=showOnlineOnly?users.filter(user=>onlineUsers.includes(user._id)):users;

    if(isUsersLoading) return <SideBarSkeleton/>

    return <aside className="h-full w-20 overflow-y-auto lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
                <div className="border-b border-base-300 w-full p-5">
                    <div className="flex items-center gap-2">
                        <Users className="size-6"/>
                        <span className="font-medium hidden lg:block">Contacts</span>
                    </div>
                    
                    {/* Online filter */}
                    <div className="mt-3 hidden lg:flex items-center gap-2">
                        <label className="cursor-pointer flex items-center gap-2">
                            <input type="checkbox" checked={showOnlineOnly} onChange={(e)=>setShowOnlineOnly(e.target.checked)} className="checkbox checkbox-sm"/>  
                            <span className="text-sm">Show online only</span>  
                        </label>    
                        <span className="text-xs text-zinc-500">{onlineUsers.length-1} online</span>
                    </div>                


                    <div className="overflow-y-auto w-full py-3"> 
                        {filteredUsers.map((user)=>(<button key={user._id} onClick={()=>{setSelectedUser(user)}} className={`w-full p-3 flex items-center rounded-full gap-3
                             hover:bg-base-300 my-1 transition-colors ${selectedUser?._id===user._id?"bg-base-300 ring-1 ring-base-300":""}`}>
                            <div className="relative mx-auto lg:mx-0">
                                <img src={user.profilePic||pfp} alt={user.userName} className="size-12 rounded-full object-cover"/>
                                {onlineUsers.includes(user._id) && (<span className="absolute-bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"/>)}
                            </div>
                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">{user.userName}</div>
                                <div className="text-sm text-zinc-400">
                                    {onlineUsers.includes(user._id)?"online":"offline"}
                                </div>
                            </div>
                        </button>))}
                    </div>
                </div>
            </aside>
} 

export default SideBar;