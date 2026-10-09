import { Request, Response } from 'express';
import { Skill } from '../models/Skill.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, grouped } = req.query;
    const filter = category ? { category } : {};

    const skills = await Skill.find(filter).sort({ category: 1, order: 1, proficiency: -1 });

    if (grouped === 'true') {
      const groupedSkills = skills.reduce((acc: any, skill) => {
        const cat = skill.category;
        if (!acc[cat]) {
          acc[cat] = [];
        }
        acc[cat].push(skill);
        return acc;
      }, {});
      successResponse(res, groupedSkills, 'Skills retrieved successfully');
      return;
    }

    successResponse(res, skills, 'Skills retrieved successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to fetch skills', 500);
  }
};

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await Skill.create(req.body);
    successResponse(res, skill, 'Skill created successfully', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create skill', 500);
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      errorResponse(res, 'Skill not found', 404);
      return;
    }
    successResponse(res, skill, 'Skill updated successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update skill', 500);
  }
};

export const deleteSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      errorResponse(res, 'Skill not found', 404);
      return;
    }
    successResponse(res, { id: req.params.id }, 'Skill deleted successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete skill', 500);
  }
};
