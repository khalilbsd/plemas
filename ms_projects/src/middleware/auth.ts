import passport from "passport";

import { ForbiddenError } from "../errors/http";
import logger from "../log/config.js";
import { getUserByEmail } from "../services/user/user.service";
import { UnAuthorized } from "../utils/appError";
import { NextFunction, Request, Response } from "express";

import { IUser } from "models/users/IUser.interface";
//passport strategy connection
export const authenticateUser = async (payload: any, done: Function) => {
  try {
    const user = await getUserByEmail(payload.email);

    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    logger.error(error);
    return done(null, false);
  }
};

export const isUserAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: IUser) => {
      if (err) {
        // Handle unexpected errors
        logger.error(err);
        return next(err);
      }
      if (!user) {
        // Custom response when user is not authenticated
        // throw new UnauthorizedError()
        next(new UnAuthorized("You are not authorized for this action."));
      }
      // If authentication succeeds, store user in request object
      req.user = user;
      next();
    }
  )(req, res, next);
};

export const checkUserRole =
  (roles: Array<string>) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnAuthorized("User is not authenticated."));

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError();
    } else {
      return next();
    }
  };
