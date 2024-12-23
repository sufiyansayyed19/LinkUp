import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUsersForSidebar, sendMessage } from '../controllers/message.controller.js';

const router = express.Router();

// getting users of sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// getting message history of a user
router.get("/id:", protectRoute, getMessages);

// sending message route
router.post("/send/:id", protectRoute, sendMessage);


export default router;