// import passport from "passport";
import { UnAuthorized } from "../utils/appError.js";
import { ForbiddenError } from "../errors/http.js";
import logger from "../log/config.js";
import { getUserByEmail } from "../services/users/user.service.js";
import passport from "../config/passport-config.js";

//passport strategy connection
export const authenticateUser = async (payload, done) => {
  try {
    const user = await getUserByEmail(payload.email);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    logger.error(error);
    return done(null, false);
  }
};

export const isUserAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      logger.error(err);
      return next(err);
    }
    if (!user) {
      console.log("the middleware refused");
      next(new UnAuthorized("You are not authorized for this action."));
    }
    // If authentication succeeds, store user in request object
    req.user = user;
    next();
  })(req, res, next);
};

export const checkUserRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ForbiddenError();
  } else {
    next();
  }
};
