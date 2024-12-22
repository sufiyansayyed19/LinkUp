import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';

dotenv.config();
const app = express();

//middleware handler
app.use(express.json()); // parsing incoming json into js object for req.body
app.use(cookieParser()); // parsing cookie and making them accessible through req.cookies


//route handler
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);


const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
})