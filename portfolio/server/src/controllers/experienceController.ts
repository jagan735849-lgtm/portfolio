import { Request, Response } from 'express';
import { Experience } from '../models/Experience.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    const experiences = await Experience.find().sort({ order: 1, createdAt: -1 });
    successResponse(res, experiences, 'Experiences retrieved successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to fetch experiences', 500);
  }
};

export const createExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    if (typeof body.description === 'string') {
      body.description = body.description.split('\n').map((d: string) => d.trim()).filter(Boolean);
    }
    if (typeof body.technologies === 'string') {
      body.technologies = body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const exp = await Experience.create(body);
    successResponse(res, exp, 'Experience created successfully', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create experience', 500);
  }
};

export const updateExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    if (typeof body.description === 'string') {
      body.description = body.description.split('\n').map((d: string) => d.trim()).filter(Boolean);
    }
    if (typeof body.technologies === 'string') {
      body.technologies = body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const exp = await Experience.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!exp) {
      errorResponse(res, 'Experience not found', 404);
      return;
    }
    successResponse(res, exp, 'Experience updated successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update experience', 500);
  }
};

export const deleteExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id);
    if (!exp) {
      errorResponse(res, 'Experience not found', 404);
      return;
    }
    successResponse(res, { id: req.params.id }, 'Experience deleted successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete experience', 500);
  }
};
