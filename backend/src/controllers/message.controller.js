import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

//getting users of sidebar
export const getUsersForSidebar = async (req, res) => {
    
    try {
        const loggedInUserId = req.user._id;
        const filterdUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-passwrod");
        res.status(200).json(filterdUsers);
    } catch (error){
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }

}


// getting message history of a user
export const getMessages = async (req, res) =>{
    try{
        const {id: otherUserId} = req.params;
        const loggedInUserId = req.user._id;;

        const messages = await Message.find({
            $or: [
                {senderId: loggedInUserId, receiverId: otherUserId},
                {senderId: otherUserId, receiverId: loggedInUserId}
            ]
        });
        // .sort({createdAt: 1});
        res.status(200).json(messages);  
    } catch(error){
        console.error("Error in controller getMessages : ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

// sending message route
export const sendMessage = async (req, res) => {
    try{
        const {id: receiverId} = req.params;
        const {text, image} = req.body;
        const senderId = req.user._id;
        let imageUrl = "";
        if (image){ 
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        // to do: realtime functionality goes here => socket.io
        res.status(201).json(newMessage);
    } catch(error){
        console.error("Error in controller sendMessage: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}   