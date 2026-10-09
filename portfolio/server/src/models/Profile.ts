import mongoose, { Document, Schema } from 'mongoose';
import { IProfile } from '../types/index.js';

export interface IProfileDoc extends IProfile, Document {}

const ProfileSchema = new Schema<IProfileDoc>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
    },
    careerObjective: {
      type: String,
      trim: true,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '/uploads/avatar.png',
    },
    resumeUrl: {
      type: String,
      default: '/uploads/resume.pdf',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    availableForHire: {
      type: Boolean,
      default: true,
    },
    yearsOfExperience: {
      type: Number,
      default: 3,
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: '' },
      website: { type: String, default: 'https://portfolio.dev' },
    },
    strengths: {
      type: [String],
      default: [
        'Full-Stack Architecture & Microservices',
        'Clean, Maintainable & Scalable Code',
        'Intuitive UI/UX and Responsive Design',
        'RESTful & GraphQL API Design',
        'Database Optimization & Caching',
      ],
    },
    stats: {
      projectsCompleted: { type: Number, default: 25 },
      satisfiedClients: { type: Number, default: 18 },
      yearsExperience: { type: Number, default: 4 },
      codeCommits: { type: Number, default: 1250 },
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model<IProfileDoc>('Profile', ProfileSchema);
