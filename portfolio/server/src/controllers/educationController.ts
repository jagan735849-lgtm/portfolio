import { Request, Response } from 'express';
import { Education } from '../models/Education.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getEducations = async (req: Request, res: Response): Promise<void> => {
  try {
    const educations = await Education.find().sort({ order: 1, createdAt: -1 });
    successResponse(res, educations, 'Educations retrieved successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to fetch educations', 500);
  }
};

export const createEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const edu = await Education.create(req.body);
    successResponse(res, edu, 'Education created successfully', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create education', 500);
  }
};

export const updateEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!edu) {
      errorResponse(res, 'Education not found', 404);
      return;
    }
    successResponse(res, edu, 'Education updated successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update education', 500);
  }
};

export const deleteEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) {
      errorResponse(res, 'Education not found', 404);
      return;
    }
    successResponse(res, { id: req.params.id }, 'Education deleted successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete education', 500);
  }
};
