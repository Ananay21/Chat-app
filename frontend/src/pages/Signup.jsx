import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore.js";
import { Mail, MessageSquare, User,RectangleEllipsis, EyeOff, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import { toast } from "react-hot-toast";

const Signup=()=>{
    const [showPassword,updateShowPassword]=new useState(false);
    const[formData,updateFormData]=new useState({userName:"",email:"",password:""});
    const {signUp,isSigningUp}=useAuthStore();

    const validateForm=()=>{
        if(!formData.userName.trim()) return toast.error("Username is required!");
        if(!formData.email.trim()) return toast.error("Email-ID is required!");
        if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if(!formData.password) return toast.error("Password is required!");
        if(formData.password.length<=5) return toast.error("Password must be at least 6 characters!");

        return true;
    };
    const handleSubmit=(event)=>{
        event.preventDefault();
        const success=validateForm();
        if(success===true){
            signUp(formData);   
        }
    };
    

    return <div className="min-h-screen grid lg: grid-cols-2">
        {/* left side */}
        <div className="flex flex-col justify-center items-center p-6  sm:p-12">
            <div className="w-full max-w-md space-y-8">
                {/*LOGO */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-2 group">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <MessageSquare className="size-6 text-primary"/>
                        </div>
                        <h1 className="text-2xl font-bold mt-2">Create an account</h1>
                        <p className="text-base-content/60">Get started with your free account</p>
                    </div>
                </div>
                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Username</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="size-5 text-base-content/40"/>
                            </div>
                            <input type="text" className="input input-bordered w-full pl-10" placeholder="Your Username" value={formData.userName} onChange={(e)=>{updateFormData({...formData,userName:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Email-ID</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="size-5 text-base-content/40"/>
                            </div>
                            <input type="email" className="input input-bordered w-full pl-10" placeholder="Your email" value={formData.email} onChange={(e)=>{updateFormData({...formData,email:e.target.value})}}/>
                        </div>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium">Password</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <RectangleEllipsis className="size-5 text-base-content/40"/>
                            </div>
                            <input type={showPassword?"text":"password"} className="input input-bordered w-full pl-10" placeholder="Your password" value={formData.password} onChange={(e)=>{updateFormData({...formData,password:e.target.value})}}/>
                            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex-items-center" onClick={()=>{updateShowPassword(!showPassword)}}>
                                {showPassword?<Eye className="size-5 text-base-content/40"/>:<EyeOff className="size-5 text-base-content/40"/>}
                            </button>
                        </div>
                    </div>
                <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
                    {isSigningUp?<><Loader2 className="size-5 animate-spin"/>....Loading</>:<>Create Account</>}
                </button>
                </form>
                <div className="text-center">
                    <p className="text-base-content/60">
                        Already have an account?{" "}
                        <Link to="/login" className="link link-primary">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
        {/* {right side} */}
        <div className="min-h-screen bg-base-200 flex justify-center align-center pt-10">
          <AuthImagePattern title="Join our community" subtitle="Connect with friends, share moments, and stay in touch with your loved ones."/>  
        </div>
    </div>
}

export default Signup;