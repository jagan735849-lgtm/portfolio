import { Response } from 'express';

export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: any;
}

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200
): Response => {
  const response: IApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const paginatedResponse = <T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number },
  message: string = 'Data retrieved successfully'
): Response => {
  const response: IApiResponse<T[]> = {
    success: true,
    message,
    data,
    pagination,
  };
  return res.status(200).json(response);
};

export const errorResponse = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors: any = null
): Response => {
  const response: IApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};
