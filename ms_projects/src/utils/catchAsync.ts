import { NextFunction, Request, RequestHandler, Response } from "express";
import logger from "log/config";

// export const catchAsync = (fn: Function) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         fn(req, res, next).catch(next);
//     };
// };

interface AsyncMiddleware {
  (req: Request, res: Response, next: NextFunction): Promise< void | Response>;
}

export const catchAsync = (middleware: AsyncMiddleware): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await middleware(req, res, next);
    } catch (error) {
      // Log the error
      logger.error(error);
      // Pass the error to Express's default error handler
      next(error);
    }
  };
};
