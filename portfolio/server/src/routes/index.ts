import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import projectRoutes from './projectRoutes.js';
import skillRoutes from './skillRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import educationRoutes from './educationRoutes.js';
import contactRoutes from './contactRoutes.js';
import adminRoutes from './adminRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import { getDBStatus } from '../config/db.js';
import { successResponse } from '../utils/apiResponse.js';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  const dbStatus = getDBStatus();
  successResponse(res, {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  }, 'API server is running and healthy');
});

// Mount module routes
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/experience', experienceRoutes);
router.use('/education', educationRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);

export default router;
