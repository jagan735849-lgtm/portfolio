import { Request, Response } from 'express';
import { Admin } from '../models/Admin.js';
import { signToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { AuthenticatedRequest } from '../types/index.js';
import { ENV } from '../config/env.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      errorResponse(res, 'Invalid credentials', 401);
      return;
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = signToken({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    // Set secure HTTP-only cookie
    const isProduction = ENV.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    successResponse(
      res,
      {
        token,
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      'Login successful'
    );
  } catch (error: any) {
    errorResponse(res, error.message || 'Login failed', 500);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const isProduction = ENV.NODE_ENV === 'production';
    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    });
    successResponse(res, null, 'Logged out successfully');
  } catch (error: any) {
    errorResponse(res, 'Logout failed', 500);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      errorResponse(res, 'Unauthorized', 401);
      return;
    }

    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      errorResponse(res, 'User not found', 404);
      return;
    }

    successResponse(res, admin, 'User profile retrieved');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to fetch user', 500);
  }
};
