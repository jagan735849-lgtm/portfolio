import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/apiResponse.js';

export const authenticateAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token: string | undefined;

    // Check Authorization header: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Check HTTP-only cookie
      token = req.cookies.token;
    }

    if (!token) {
      errorResponse(res, 'Authentication required. Please log in.', 401);
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      errorResponse(res, 'Session expired. Please log in again.', 401);
      return;
    }
    errorResponse(res, 'Invalid authentication token.', 401);
  }
};
