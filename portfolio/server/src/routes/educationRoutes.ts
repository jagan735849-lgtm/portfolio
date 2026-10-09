import { Router } from 'express';
import {
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { validateBody, validateEducation } from '../validators/index.js';

const router = Router();

// Public
router.get('/', getEducations);

// Admin
router.post('/', authenticateAdmin, validateBody(validateEducation), createEducation);
router.put('/:id', authenticateAdmin, validateBody(validateEducation), updateEducation);
router.delete('/:id', authenticateAdmin, deleteEducation);

export default router;
