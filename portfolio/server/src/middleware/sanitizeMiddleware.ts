import { Request, Response, NextFunction } from 'express';

const cleanData = (obj: any): any => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanData);
  }

  const clean: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    // Prevent NoSQL injection ($ where/gt/lt/etc.) and property pollution
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = cleanData(obj[key]);
  }
  return clean;
};

export const sanitizeNoSql = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) {
    req.body = cleanData(req.body);
  }
  if (req.params) {
    req.params = cleanData(req.params);
  }
  if (req.query) {
    req.query = cleanData(req.query);
  }
  next();
};
