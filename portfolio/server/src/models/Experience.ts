import mongoose, { Document, Schema } from 'mongoose';
import { IExperience } from '../types/index.js';

export interface IExperienceDoc extends IExperience, Document {}

const ExperienceSchema = new Schema<IExperienceDoc>(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role title is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
      default: 'Full-time',
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: String,
      default: '',
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    description: {
      type: [String],
      required: [true, 'At least one bullet point description is required'],
    },
    technologies: {
      type: [String],
      default: [],
    },
    certificateUrl: {
      type: String,
      trim: true,
      default: '',
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

ExperienceSchema.index({ order: 1, createdAt: -1 });

export const Experience = mongoose.model<IExperienceDoc>('Experience', ExperienceSchema);
