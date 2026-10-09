import { Router } from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { validateBody, validateSkill } from '../validators/index.js';

const router = Router();

// Public
router.get('/', getSkills);

// Admin
router.post('/', authenticateAdmin, validateBody(validateSkill), createSkill);
router.put('/:id', authenticateAdmin, validateBody(validateSkill), updateSkill);
router.delete('/:id', authenticateAdmin, deleteSkill);

export default router;
