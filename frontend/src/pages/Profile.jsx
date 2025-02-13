import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Camera, Mail, User } from "lucide-react";
import pfp from "../assets/pfp.jpg";

const Profile=()=>{
    const {authUser,isUpdatingProfile,updateProfile}=useAuthStore();

    const handleImageUpload=async (e)=>{
        const file=e.target.files[0];
        if(!file) return;
        const reader=new FileReader();
        reader.readAsDataURL(file);
        reader.onload=async()=>{
            const base64Image=reader.result;
            await updateProfile({profilePic:base64Image});
            console.log(authUser.profilePic);
        }
    }

    return <div className="flex justify-center h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8 bg-base-300 rounded-xl mb-4 px-10" >
            <div className="rounded-xl p-6 space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold" >Profile</h1>
                    <p className="mt-2">Your Profile information</p>
                </div>
                

                {/* avatar upload section */}

                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <img src={authUser.profilePic||pfp} alt="Profile" className="size-20 rounded-full border-2 border-white"/>
                        <label htmlFor="avatar-upload" className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile? "animate-pulse pointer-events-none":""}`}>
                        <Camera className="w-5 h-5 text-base-200"/>
                        <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile}/>
                    </label>
                    </div>
                </div>
                <p className="text-sm text-zinc-400">{isUpdatingProfile?"Uploading...":"Click the Camera Icon to upload your photo"}</p>
            </div>
            
            
            <div className="space-y-6">
                <div className="space-y-1.5">
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <User className="size-4"/>
                        Username
                    </div>
                    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.userName}</p>
                </div>

                <div className="space-y-1.5">
                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                        <Mail className="size-4"/>
                        Email-ID
                    </div>
                    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                </div>  

                <div className="flex justify-between items-center mt-5">
                    <span>Member since</span>
                    <span>{authUser.createdAt?.split("T")[0]}</span>
                </div> 
            </div>
        </div>
    </div>
}

export default Profile;