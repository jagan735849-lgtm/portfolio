import { Request, Response } from 'express';
import { Profile } from '../models/Profile.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create fallback profile if none exists
      profile = await Profile.create({
        name: 'Alex Mercer',
        title: 'Senior Full-Stack Developer & Cloud Architect',
        tagline: 'Crafting resilient, high-performance web systems and intuitive digital experiences.',
        bio: 'Passionate software engineer with over 5 years of experience building modern web apps, distributed backends, and responsive user interfaces. Enthusiastic about TypeScript, React, Node.js, and cloud platforms.',
        avatarUrl: '/uploads/avatar.png',
        resumeUrl: '/uploads/resume.pdf',
        email: 'alex.mercer.dev@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA / Remote',
        availableForHire: true,
        yearsOfExperience: 5,
        socialLinks: {
          github: 'https://github.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          website: 'https://alexmercer.dev',
        },
        strengths: [
          'Full-Stack Architecture & Microservices',
          'High Performance React & TypeScript Web Apps',
          'Scalable REST & GraphQL Node.js APIs',
          'Cloud-Native Deployments & DevOps Pipelines',
          'Database Design, Query Tuning & Redis Caching',
        ],
        stats: {
          projectsCompleted: 34,
          satisfiedClients: 22,
          yearsExperience: 5,
          codeCommits: 2840,
        },
      });
    }

    successResponse(res, profile, 'Profile retrieved successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to retrieve profile', 500);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }

    successResponse(res, profile, 'Profile updated successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update profile', 500);
  }
};
