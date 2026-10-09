import mongoose, { Document, Schema } from 'mongoose';
import { IEducation } from '../types/index.js';

export interface IEducationDoc extends IEducation, Document {}

const EducationSchema = new Schema<IEducationDoc>(
  {
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      required: [true, 'Field of study is required'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: '',
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
    grade: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
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

EducationSchema.index({ order: 1, createdAt: -1 });

export const Education = mongoose.model<IEducationDoc>('Education', EducationSchema);
