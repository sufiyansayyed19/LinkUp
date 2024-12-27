import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';

dotenv.config();
const app = express();

//middleware handler
app.use(express.json({ limit: "10mb" })); // Allows large payloads for Base64 images
 // parsing incoming json into js object for req.body
app.use(cookieParser()); // parsing cookie and making them accessible through req.cookies
app.use(cors({ 
    origin: "http://localhost:5173",
     credentials:true}));

//route handler
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
})