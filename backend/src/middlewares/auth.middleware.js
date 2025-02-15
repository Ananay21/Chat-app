import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const protectRoute=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized- no token provided!"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message:"Unauthorized- Invalid Token!"});
        }

        const user=await userModel.findById(decoded.userID).select("-password");

        if(!user){
            return res.status(404).json({message:"user not found!"});
        }

        req.user=user;

        next();
    }catch(error){
        console.log("error in protectRoute middleware as: ",error.message);
        res.status(500).json({message:"Internal server error!"});
    }
}