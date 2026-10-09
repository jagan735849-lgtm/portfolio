export interface IUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'programming' | 'tools' | 'other';
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface ISkill {
  _id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  level: SkillLevel;
  icon?: string;
  order: number;
  createdAt?: string;
}

export type ProjectCategory = 'Full Stack' | 'Frontend' | 'Backend' | 'Mobile' | 'Cloud/DevOps' | 'AI/ML' | 'Other';

export interface IProject {
  _id: string;
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
  createdAt?: string;
}

export interface IExperience {
  _id: string;
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
}

export interface IEducation {
  _id: string;
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
}

export interface IProfile {
  _id: string;
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
}

export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: any;
}

export interface IDashboardStats {
  counts: {
    projects: number;
    featuredProjects: number;
    skills: number;
    experience: number;
    education: number;
    messages: number;
    unreadMessages: number;
  };
  skillsByCategory: { _id: string; count: number }[];
  projectsByCategory: { _id: string; count: number }[];
  recentMessages: IContactMessage[];
}
