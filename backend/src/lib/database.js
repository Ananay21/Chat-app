import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        const connection=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGODB connection successful on ${connection.connection.host}`)
    } catch (error) {
        console.log(`error connecting to MONGODB due to ${error}`);
    }
}

export default connectDB;