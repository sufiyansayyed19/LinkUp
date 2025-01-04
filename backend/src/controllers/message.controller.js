import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";
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
    try {
        const { id: receiverId } = req.params;
        const { text, image } = req.body;
        const senderId = req.user._id;

        if (!receiverId || (!text && !image)) {
            return res.status(400).json({ error: "Receiver ID and either text or image are required." });
        }

        let imageUrl = "";
        if (image) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    folder: "messages", // Optional: Organize in a folder
                    resource_type: "auto", // Handle images, videos, etc.
                });
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error: ", uploadError.message);
                return res.status(500).json({ error: "Image upload failed." });
            }
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // TO DO: getting message receiver's socket id and sending message to that socket
        // completed
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }    
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in controller sendMessage: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
   