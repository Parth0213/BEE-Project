// router/messageRouter.js
import express from 'express';
import { sendMessage } from '../controller/messageController.js';

const router = express.Router();

// Define route for sending messages
router.post('/send', sendMessage);

export default router;
