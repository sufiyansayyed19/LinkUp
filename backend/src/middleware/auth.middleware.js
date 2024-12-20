import jwt from '../lib/utils.js';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        // Check if token exists in cookies
        const token = req.cookies.jwt;
        
        if(!token){
            return res.status(401).json({message: "Unauthorized- No Token provided"});
        }

        // Verify if the token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded){
            return res.status(401).json({message: "Unauthorized- No Token provided"});
        }

        // Find user by the ID stored in the token
        const user = await User.findById(decoded.userId).select("-password");


        
        if(!user) {
            return res.status(404).json({message: "user no found"});
        }

        // Attach the user object to the request for future use
        req.user = user;

         // Proceed to the next middleware or route handler
        next();

    }catch(error){
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({message: "Internal server error."})
    }
}