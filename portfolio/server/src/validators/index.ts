import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/apiResponse.js';

export type ValidatorFn = (body: any) => { isValid: boolean; errors: Record<string, string> };

export const validateBody = (validator: ValidatorFn) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { isValid, errors } = validator(req.body);
    if (!isValid) {
      errorResponse(res, 'Validation failed', 400, errors);
      return;
    }
    next();
  };
};

export const validateLogin: ValidatorFn = (body) => {
  const errors: Record<string, string> = {};
  if (!body.email || typeof body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.email = 'A valid email address is required';
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateContact: ValidatorFn = (body) => {
  const errors: Record<string, string> = {};
  if (body.honeypot) {
    errors.honeypot = 'Bot detected';
  }
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.name = 'Name is required';
  }
  if (!body.email || typeof body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.email = 'A valid email address is required';
  }
  if (!body.subject || typeof body.subject !== 'string' || body.subject.trim().length === 0) {
    errors.subject = 'Subject is required';
  }
  if (!body.message || typeof body.message !== 'string' || body.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateProject: ValidatorFn = (body) => {
  const errors: Record<string, string> = {};
  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    errors.title = 'Project title is required';
  }
  if (!body.description || typeof body.description !== 'string' || body.description.trim().length === 0) {
    errors.description = 'Short description is required';
  }
  if (!body.technologies || (!Array.isArray(body.technologies) && typeof body.technologies !== 'string')) {
    errors.technologies = 'Technologies must be provided as an array or comma-separated list';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateSkill: ValidatorFn = (body) => {
  const errors: Record<string, string> = {};
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.name = 'Skill name is required';
  }
  if (!body.category || typeof body.category !== 'string') {
    errors.category = 'Skill category is required';
  }
  if (body.proficiency !== undefined && (typeof body.proficiency !== 'number' || body.proficiency < 0 || body.proficiency > 100)) {
    errors.proficiency = 'Proficiency must be a number between 0 and 100';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateExperience: ValidatorFn = (body) => {
  const errors: Record<string, string> = {};
  if (!body.company || typeof body.company !== 'string' || body.company.trim().length === 0) {
    errors.company = 'Company is required';
  }
  if (!body.role || typeof body.role !== 'string' || body.role.trim().length === 0) {
    errors.role = 'Role is required';
  }
  if (!body.startDate || typeof body.startDate !== 'string' || body.startDate.trim().length === 0) {
    errors.startDate = 'Start date is required';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateEducation: ValidatorFn = (body) => {
  const errors: Record<string, string> = {};
  if (!body.institution || typeof body.institution !== 'string' || body.institution.trim().length === 0) {
    errors.institution = 'Institution is required';
  }
  if (!body.degree || typeof body.degree !== 'string' || body.degree.trim().length === 0) {
    errors.degree = 'Degree is required';
  }
  if (!body.fieldOfStudy || typeof body.fieldOfStudy !== 'string' || body.fieldOfStudy.trim().length === 0) {
    errors.fieldOfStudy = 'Field of study is required';
  }
  if (!body.startDate || typeof body.startDate !== 'string' || body.startDate.trim().length === 0) {
    errors.startDate = 'Start date is required';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
