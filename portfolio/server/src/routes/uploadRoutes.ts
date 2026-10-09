import { Router } from 'express';
import { uploadFile } from '../controllers/uploadController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Admin-only file uploads
router.post('/', authenticateAdmin, upload.single('file'), uploadFile);

export default router;
