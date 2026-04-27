import express from 'express';
import { getChatHistory, getMyChats, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/chats', protect, getMyChats);
router.get('/:userId', protect, getChatHistory);
router.post('/:userId', protect, sendMessage);

export default router;

