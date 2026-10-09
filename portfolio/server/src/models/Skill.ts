import mongoose, { Document, Schema } from 'mongoose';
import { ISkill } from '../types/index.js';

export interface ISkillDoc extends ISkill, Document {}

const SkillSchema = new Schema<ISkillDoc>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: ['frontend', 'backend', 'database', 'programming', 'tools', 'other'],
      default: 'frontend',
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency is required'],
      min: [0, 'Proficiency must be at least 0'],
      max: [100, 'Proficiency cannot exceed 100'],
      default: 80,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Advanced',
    },
    icon: {
      type: String,
      default: 'Code',
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

SkillSchema.index({ name: 1, category: 1 }, { unique: true });
SkillSchema.index({ category: 1, order: 1 });

export const Skill = mongoose.model<ISkillDoc>('Skill', SkillSchema);
