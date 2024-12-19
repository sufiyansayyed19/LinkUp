import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(express.json()); // parsing incoming json into js object for req.body
app.use(cookieParser()); // parsing cookie and making them accessible through req.cookies
app.use("/api/auth", authRoutes);


const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`);
    connectDB();
})