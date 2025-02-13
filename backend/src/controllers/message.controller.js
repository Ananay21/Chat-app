import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketID } from "../lib/socket.js";
import { io } from "../lib/socket.js";

export const getUsersForSideBar=async (req,res)=>{
    try{
        const userID=req.user._id;
        const filteredUsers=await userModel.find({_id: { $ne : userID } }).select("-password");

        return res.status(200).json(filteredUsers);
    }catch(error){
        console.log(`error in getting users in msg controller :${error.message}`);
        return res.status(500).json({message:"Internal server message!"});
    }
};

export const getMessages=async (req,res)=>{
    try {
        const {id:chatterID}=req.params;
        const myID=req.user._id;

        const messages=await messageModel.find({
            $or:[
                    {
                        senderID:myID,
                        recieverID:chatterID
                    },
                    {
                        senderID:chatterID,
                        recieverID:myID
                    }
                ]
            }
        );
        res.status(200).json({messages:messages});
    } catch (error) {
        console.log(`error in getMessages controller :${error.message}`);
        return res.status(500).json({message:"Internal server message!"});
    }
}

export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:chatterID}=req.params;
        const myID=req.user._id;

        let imageURL;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageURL=uploadResponse.secure_url;
        }
        const newMessage=await messageModel.create({senderID:myID,recieverID:chatterID,text:text,image:imageURL});
        await newMessage.save();

        const recieverSocketID= getReceiverSocketID(chatterID);
        if(recieverSocketID){
            io.to(recieverSocketID).emit("newMessage",newMessage);
        }

        return res.status(201).json(newMessage);
    }catch(error){
        console.log(`error in sendMessage controller :${error.message}`);
        return res.status(500).json({message:"Internal server message!"});
    }
};