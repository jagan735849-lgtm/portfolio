import { Request, Response } from 'express';
import { Project } from '../models/Project.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Education } from '../models/Education.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalProjects,
      featuredProjects,
      totalSkills,
      totalExperiences,
      totalEducations,
      totalMessages,
      unreadMessages,
      recentMessages,
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Skill.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Skill breakdown by category
    const skillsByCategory = await Skill.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Projects breakdown by category
    const projectsByCategory = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    successResponse(
      res,
      {
        counts: {
          projects: totalProjects,
          featuredProjects,
          skills: totalSkills,
          experience: totalExperiences,
          education: totalEducations,
          messages: totalMessages,
          unreadMessages,
        },
        skillsByCategory,
        projectsByCategory,
        recentMessages,
      },
      'Dashboard stats retrieved successfully'
    );
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to retrieve dashboard stats', 500);
  }
};
