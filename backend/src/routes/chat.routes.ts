import { Router } from 'express';
import { sendMessage } from '../controllers/chat.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Route to handle chat messages
router.post('/', authenticateJWT as any, sendMessage as any);

export default router;


