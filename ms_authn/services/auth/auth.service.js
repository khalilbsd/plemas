import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../../config/environment.config.js";
import User from "../../models/users/User.model.js";
import { ElementNotFound, MissingParameter } from "../../utils/appError.js";
import { messages } from "../../i18n/messages.js";
import logger from "../../log/config.js";
import { encryptPassword, getUserByEmail } from "../users/user.service.js";



export const authenticate = async (user, bodyPassword, next) => {
  if (!user.password)
    return next(
      new UnknownError(messages["inactive_account_refer_activation_email"])
    );
  const isPasswordMatch = bcrypt.compareSync(bodyPassword, user.password);
  if (!isPasswordMatch) return null;

  // generate new token
  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
      isSuperUser: user.isSuperUser
    },

    config.jwt_secret,
    { expiresIn: "2d" }
  );
  if (!user.firstLogin) {
    user.firstLogin = true;
    await user.save();
  }

  return token;
};

export const resetUserPassword = async (body, next, userEmail = null) => {
  try {
    const { password, confirmPassword } = body;
    const email = body.email || userEmail;
    const user = await getUserByEmail(email)
    console.log(user)
    if (!user) {
      return next(new ElementNotFound(messages.user_not_found));
    }

    if (!email || !password || !confirmPassword) {
      logger.error("one of the parameters is not found");
      return next(new MissingParameter(messages[500]));
    }

    if (password !== confirmPassword) {
      logger.error("password doesn't match ");
      return null;
    }

    const encrypted = await encryptPassword(password);

    user.password = encrypted;
    // console.log("user password", encrypted);
    // const
    user.token = null;
    user.active = true;
    await user.save();

    return user;
  } catch (error) {
    logger.error(error);
  }
  // if (password )
};


