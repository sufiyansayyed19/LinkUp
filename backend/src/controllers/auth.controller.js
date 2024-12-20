import User from '../models/user.model.js';
import bycrpt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    // console.log(req.body);
    const { fullName, email, password } = req.body;

    try {
        // Check if any field is empty
        // if (password.length == 0 || fullName.length == 0 || email.length == 0) {
        //     return res.status(400).json({ message: "Please fill all the fields" });
        // }

        if (!password || !fullName || !email) return res.status(400).json({message:"all fields are required" })

        if (!email.includes("@")){
            return res.status(400).json({message: "Please enter the valid email id"});
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters." });
        }

        // Check if email already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists." });

        // Hash password
        const salt = await bycrpt.genSalt(10);
        const hashPassword = await bycrpt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashPassword,
        });

        if (newUser) {
            // Generate JWT token
            generateToken(newUser._id, res);

            // Save the new user to the database
            await newUser.save();

            // Send the user data in the response
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "Invalid user data." });
        }

    } catch (error) {
        console.log("Error in Signup controller", error.message);
        return res.status(500).json({ message: "Internal Server error" });
    }
};


export const login = async (req,res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message: "Invalid credentials"});
        } else{
            console.log(user)
            const match = await bycrpt.compare(password, user.password);
            if (!match) return res.status(400).json({ message: "Invalid credentials" });
            generateToken(user._id, res);  
            return res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            });
            } 
    } catch (error) {
        res.status(500).json({message:"internal server error"});
        console.log("Contoller error: ", error.message);
    }


    // res.send("Login");
}

export const logout = (req,res)=>{
    try{
    res.cookie("jwt","", ({maxAge: 0}));
    res.status(200).json({message: "Logged out successfully"});
    } catch(error){
        console.log("Error in controller", error.message);
        res.status(500).json({message: "internal server error"});
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if (!profilePic) return res.status(400).json({message: "profile image is required"})
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResponse.secure_url},
            {new: true}  // gives us updated object when added to findByIdAndUpdate
        )
        
        res.status(200).json(updateUser);
    } catch (error) {
        console.log("Error in updateProfile", error);
        res.status(500).json({message: "Internal server error"})
    }
}