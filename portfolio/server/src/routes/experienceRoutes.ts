import { Router } from 'express';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { validateBody, validateExperience } from '../validators/index.js';

const router = Router();

// Public
router.get('/', getExperiences);

// Admin
router.post('/', authenticateAdmin, validateBody(validateExperience), createExperience);
router.put('/:id', authenticateAdmin, validateBody(validateExperience), updateExperience);
router.delete('/:id', authenticateAdmin, deleteExperience);

export default router;
