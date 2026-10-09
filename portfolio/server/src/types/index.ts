import { Request } from 'express';

export interface IUserPayload {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUserPayload;
}

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'programming' | 'tools' | 'other';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface ISkill {
  name: string;
  category: SkillCategory;
  proficiency: number; // 0 - 100
  level: SkillLevel;
  icon?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectCategory = 'Full Stack' | 'Frontend' | 'Backend' | 'Mobile' | 'Cloud/DevOps' | 'AI/ML' | 'Other';

export interface IProject {
  title: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  technologies: string[];
  category: ProjectCategory;
  githubUrl?: string;
  liveDemoUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExperience {
  company: string;
  role: string;
  location?: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string[];
  technologies?: string[];
  certificateUrl?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  description?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProfile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  careerObjective?: string;
  avatarUrl: string;
  resumeUrl: string;
  email: string;
  phone?: string;
  location: string;
  availableForHire: boolean;
  yearsOfExperience: number;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  strengths: string[];
  stats: {
    projectsCompleted: number;
    satisfiedClients: number;
    yearsExperience: number;
    codeCommits: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  ipAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}
