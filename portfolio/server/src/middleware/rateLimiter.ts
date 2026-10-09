import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/apiResponse.js';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    errorResponse(res, 'Too many requests from this IP, please try again after 15 minutes', 429);
  },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    errorResponse(res, 'Too many login attempts. Please try again after 15 minutes.', 429);
  },
});

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 messages per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    errorResponse(res, 'Too many messages sent from this IP. Please wait before sending another message.', 429);
  },
});
