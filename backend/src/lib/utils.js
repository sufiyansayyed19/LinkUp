import jwt from 'jsonwebtoken';

//generate token
export const generateToken  = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in milliseconds
        httpOnly: true,                   // Prevents JavaScript access to the cookie
        sameSites: "strict",              // Restricts sending the cookie to same-origin requests
        Secure: process.env.NODE_ENV !== "development",  // Uses HTTPS in production
    });

    return token;
}

