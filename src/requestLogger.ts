import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const { method, url, body, query } = req;
  const startTime = Date.now();  // Capture the start time before processing the request

  // Log the incoming request
  logger.info(`[Execution Time: --ms] Request - Method: ${method}, URL: ${url}, Body: ${JSON.stringify(body)}, Query: ${JSON.stringify(query)}`);

  // Capture the original res.send function
  const originalSend = res.send;

  // Override res.send to capture the response body and log it
  res.send = function (body: any): Response {
    const executionTime = Date.now() - startTime;  // Calculate execution duration
    // Log the response details
    logger.info(`[Execution Time: ${executionTime}ms] Response - Status: ${res.statusCode}, Body: ${JSON.stringify(body)}`);
    
    // Call the original send function with the response body
    return originalSend.call(this, body);
  };

  next(); // Pass control to the next middleware or route handler
};