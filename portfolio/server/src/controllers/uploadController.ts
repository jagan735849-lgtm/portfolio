import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      errorResponse(res, 'No file was uploaded', 400);
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    successResponse(
      res,
      {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
      'File uploaded successfully',
      201
    );
  } catch (error: any) {
    errorResponse(res, error.message || 'File upload failed', 500);
  }
};
