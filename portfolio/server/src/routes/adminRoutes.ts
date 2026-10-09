import { Router } from 'express';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/adminController.js';
import {
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import {
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController.js';
import {
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/educationController.js';
import { updateProfile } from '../controllers/profileController.js';
import {
  getMessages,
  updateMessageStatus,
  deleteMessage,
} from '../controllers/contactController.js';
import { uploadFile } from '../controllers/uploadController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  validateBody,
  validateProject,
  validateSkill,
  validateExperience,
  validateEducation,
} from '../validators/index.js';

const router = Router();

// Apply auth middleware to all admin routes
router.use(authenticateAdmin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Profile
router.put('/profile', updateProfile);

// Projects CRUD
router.post('/projects', validateBody(validateProject), createProject);
router.put('/projects/:id', validateBody(validateProject), updateProject);
router.delete('/projects/:id', deleteProject);

// Skills CRUD
router.post('/skills', validateBody(validateSkill), createSkill);
router.put('/skills/:id', validateBody(validateSkill), updateSkill);
router.delete('/skills/:id', deleteSkill);

// Experience CRUD
router.post('/experience', validateBody(validateExperience), createExperience);
router.put('/experience/:id', validateBody(validateExperience), updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education CRUD
router.post('/education', validateBody(validateEducation), createEducation);
router.put('/education/:id', validateBody(validateEducation), updateEducation);
router.delete('/education/:id', deleteEducation);

// Contact messages
router.get('/messages', getMessages);
router.patch('/messages/:id', updateMessageStatus);
router.delete('/messages/:id', deleteMessage);

// Upload
router.post('/upload', upload.single('file'), uploadFile);

export default router;
