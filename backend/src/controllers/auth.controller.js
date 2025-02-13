import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import cloudinary from "../lib/cloudinary.js";


export const signup=async(req,res)=>{
    const {userName,email,password}=req.body
    try {
        if(!userName||!email||!password){
            return res.status(400).json({message:"Please fill the required fields!"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Your password must be greater than 6"});
        }

        const user=await userModel.findOne({$or:[{userName:userName},{email:email}]});

        if(user){
            return res.status(400).json({message:"user already exists!"});
        }

        const salted=await bcryptjs.hash(password,parseInt(process.env.SALT));

        const createUser=await userModel.create({userName:userName,email:email,password:salted});

        if(!createUser){
            return res.status(500).json({message:"Something went wrong while creating the user!"});
        }

        await generateToken(createUser._id,res);
        await createUser.save();
        return res.status(201).json({id:createUser._id,userName:createUser.userName,profile:createUser.profilePic,message:"user created!"});

    } catch (error) {
        console.log("error in signup controller as: ",error.message);
        res.status(500).json({message:"Internal server error!"});
    }
};

export const login=async(req,res)=>{
    const {password,email}=req.body;
    try {
        if(!password||!email){
            return res.status(400).json({message:"please fill in the required fields!"});
        }

        const user=await userModel.findOne({email:email});

        if(!user){
            return res.status(404).json({message:"Invalid credentials!"});
        }

        const checkPassword=await bcryptjs.compare(password,user.password);

        if(!checkPassword){
            return res.status(404).json({message:"Invalid credentials!"});
        }

        await generateToken(user._id,res);

        return res.status(200).json({
            id:user._id,
            userName:user.userName,
            email:user.email,
            profilePic:user.profilePic
        });

    } catch (error) {
        console.log("error in login controller ",error.message);
        return res.status(500).json({message:"Internal server error!"});
    }
};

export const logout=async (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully!"});
    }catch(error){
        console.log("error in logout controller ",error.message);
        return res.status(500).json({message:"Internal server error!"});
    }
};

export const update=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        const userID = req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profilepic is required!"});
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updatedUser=await userModel.findByIdAndUpdate(userID,{profilePic:uploadResponse.secure_url},{new:true}); 

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update controller",error.message);
        return res.status(500).json({message:"Internal server error!"});
    }
};

export const checkAuth=async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("error in checkAuth controller");
        return res.status(500).json({message:"Internal server error!"});
    }
};