import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// Public
router.get('/', getProfile);

// Admin
router.put('/', authenticateAdmin, updateProfile);

export default router;
