import { NextFunction, Request, Response } from "express";
import { config } from "../environment.config";
import logger from "log/config";

const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};
const sendErrorProd = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err
    // stack: err.stack
  });
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  //   logger.error(err);

  if (!config.env_dev) {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
