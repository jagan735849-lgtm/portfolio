import mongoose, { Document, Schema } from 'mongoose';
import { IProject, ProjectCategory } from '../types/index.js';

export interface IProjectDoc extends IProject, Document {}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    longDescription: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, 'Project thumbnail is required'],
      default: '/uploads/project-placeholder.png',
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology must be listed'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one technology is required',
      },
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: ['Full Stack', 'Frontend', 'Backend', 'Mobile', 'Cloud/DevOps', 'AI/ML', 'Other'],
      default: 'Full Stack',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProjectSchema.index({ category: 1, featured: -1, order: 1 });
ProjectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

export const Project = mongoose.model<IProjectDoc>('Project', ProjectSchema);
