import { Request, Response } from 'express';
import { Project } from '../models/Project.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/apiResponse.js';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 12));
    const search = (req.query.search as string || '').trim();
    const category = (req.query.category as string || '').trim();
    const featured = req.query.featured;

    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await Project.countDocuments(filter);
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const projects = await Project.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(
      res,
      projects,
      {
        page,
        limit,
        total,
        totalPages,
      },
      'Projects retrieved successfully'
    );
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to fetch projects', 500);
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      errorResponse(res, 'Project not found', 404);
      return;
    }
    successResponse(res, project, 'Project details retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to fetch project', 500);
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    if (typeof body.technologies === 'string') {
      body.technologies = body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const newProject = await Project.create(body);
    successResponse(res, newProject, 'Project created successfully', 201);
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to create project', 500);
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    if (typeof body.technologies === 'string') {
      body.technologies = body.technologies.split(',').map((t: string) => t.trim()).filter(Boolean);
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      errorResponse(res, 'Project not found', 404);
      return;
    }

    successResponse(res, updatedProject, 'Project updated successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update project', 500);
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) {
      errorResponse(res, 'Project not found', 404);
      return;
    }
    successResponse(res, { id: req.params.id }, 'Project deleted successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete project', 500);
  }
};
