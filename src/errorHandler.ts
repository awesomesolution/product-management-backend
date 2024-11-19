import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Error handler middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error - Message: ${err.message}, Stack: ${err.stack}`);
  
  // Send a generic error message to the client
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
};