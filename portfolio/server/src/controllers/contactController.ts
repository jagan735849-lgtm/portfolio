import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/apiResponse.js';

export const submitMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress || '';

    const contact = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
    });

    successResponse(
      res,
      { id: contact._id, createdAt: contact.createdAt },
      'Thank you! Your message has been sent successfully. I will get back to you shortly.',
      201
    );
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to submit contact message', 500);
  }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string, 10) || 10));
    const isRead = req.query.isRead;
    const search = (req.query.search as string || '').trim();

    const filter: any = {};
    if (isRead !== undefined) {
      filter.isRead = isRead === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await ContactMessage.countDocuments(filter);
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;

    const messages = await ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    paginatedResponse(
      res,
      messages,
      {
        page,
        limit,
        total,
        totalPages,
      },
      'Contact messages retrieved successfully'
    );
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to fetch contact messages', 500);
  }
};

export const updateMessageStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { isRead } = req.body;
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: Boolean(isRead) },
      { new: true }
    );

    if (!message) {
      errorResponse(res, 'Message not found', 404);
      return;
    }

    successResponse(res, message, 'Message status updated');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to update message status', 500);
  }
};

export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      errorResponse(res, 'Message not found', 404);
      return;
    }
    successResponse(res, { id: req.params.id }, 'Message deleted successfully');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete message', 500);
  }
};
