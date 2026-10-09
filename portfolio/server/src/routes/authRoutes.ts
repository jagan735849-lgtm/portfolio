import { Router } from 'express';
import { login, logout, getMe } from '../controllers/authController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { validateBody, validateLogin } from '../validators/index.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, validateBody(validateLogin), login);
router.post('/logout', logout);
router.get('/me', authenticateAdmin, getMe);

export default router;
