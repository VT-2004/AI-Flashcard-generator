import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: unknown,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500
): void => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};