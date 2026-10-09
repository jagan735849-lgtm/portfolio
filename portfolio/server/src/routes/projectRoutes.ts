import { Router } from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { validateBody, validateProject } from '../validators/index.js';

const router = Router();

// Public
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Admin (Also mounted under /api/admin/projects or /api/projects for convenience)
router.post('/', authenticateAdmin, validateBody(validateProject), createProject);
router.put('/:id', authenticateAdmin, validateBody(validateProject), updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;
