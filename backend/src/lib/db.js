import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        console.log("MongoURI: ", process.env.MONGODB_URI);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongo DB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error: ", error)
    }
}