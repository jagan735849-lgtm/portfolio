import { Router } from 'express';
import {
  submitMessage,
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/contactController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { validateBody, validateContact } from '../validators/index.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public contact submission with rate limiting
router.post('/', contactLimiter, validateBody(validateContact), submitMessage);

// Admin contact message management
router.get('/', authenticateAdmin, getMessages);
router.patch('/:id', authenticateAdmin, updateMessageStatus);
router.delete('/:id', authenticateAdmin, deleteMessage);

export default router;
