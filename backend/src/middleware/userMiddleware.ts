import { Request, Response, NextFunction } from 'express';

/**
 * Extend Express Request type to include userId
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/**
 * Middleware to extract userId from request headers and attach to request
 * Also logs the userId for debugging/monitoring purposes
 */
export const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers['userId'] as string | undefined;
  
  if (userId) {
    req.userId = userId;
    // Log userId for debugging/monitoring (you can customize this logging)
    console.log(`[Request] userId: ${userId}, path: ${req.path}`);
  }
  
  next();
};

