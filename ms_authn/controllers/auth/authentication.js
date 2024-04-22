import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  MissingParameter,
  UnAuthorized,
  UnknownError
} from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { config } from "../../config/environment.config.js";
import logger from "../../log/config.js";
import { send } from "../../mails/config.js";

import { messages } from "../../i18n/messages.js";
import ResetPasswordToken from "../../models/users/ResetPasswordToken.model.js";
import User from "../../models/users/User.model.js";

import {
  createPasswordSetToken,
  encryptPassword,
  getUserByEmail
} from "../../services/users/user.service.js";
import {
  authenticate,
  resetUserPassword
} from "../../services/auth/auth.service.js";

export const login = catchAsync(async (req, res, next) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    return next(
      new ElementNotFound(messages["auth.login.message.non_valid_credentiels"])
    );
  }
  const token = await authenticate(user, req.body.password, next);
  if (!token)
    return res.status(401).json({
      message: messages["auth.login.message.non_valid_credentiels"],
      success: false
    });
  return res.status(200).json({
    message: "You have successfully logged in",
    token: `Bearer ${token}`,
    expiresIn: "2d"
  });
});

export const updateAccountPassword = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError(messages["500"], 500));

  const user = await resetUserPassword(req.body, next);

  if (!user) return next(new UnknownError(messages[500]));

  return res.status(200).json({
    status: "success",
    message: messages["auth.set_user_password.success"]
  });
});

/* @DESC
  function to reset password : this will only work if the user is authenticated otherwise refer to passwordResetWithToken function
*/
export const passwordReset = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword)
    return next(new MissingParameter(messages["auth.password.non_match"]));

  if (password !== confirmPassword)
    return next(new AppError(messages["auth.password.non_match"], 500));

  const user = await resetUserPassword(req.body, next, req.user.email);

  if (!user) return next(new UnknownError(messages["500"]));
  logger.info(`user ${req.user.email} changed his password successfully`);

  return res.status(200).json({
    isChanged: true,
    message: messages["auth.password.changed.successfully"]
  });
});
export const passwordResetWithToken = catchAsync(async (req, res, next) => {
  const { password, confirmPassword, token } = req.body;

  // verify the token
  const resetReq = await ResetPasswordToken.findOne({ token: token }).populate(
    "user"
  );

  // console.log(resetReq.user.email);
  if (!resetReq)
    return next(new ElementNotFound(messages["reset_password_page.not_noted"]));

  if (resetReq.expired)
    return next(new UnAuthorized(messages.request_already_fulfilled));

  const currentTimeInSameTimezone = new Date().getTime();

  if (resetReq.expiresAt.getTime() < currentTimeInSameTimezone)
    return next(
      new UnAuthorized(
        "This link has already expired. If you find something wrong with this you can try again or contact the admin"
      )
    );

  resetReq.expired = true;

  if (!password || !confirmPassword)
    return next(new MissingParameter(messages["auth.password.non_match"]));

  if (password !== confirmPassword)
    return next(new AppError(messages["auth.password.non_match"], 500));

  const user = await resetUserPassword(req.body, next, resetReq.user.email);

  if (!user) return next(new UnknownError(messages["500"]));

  await resetReq.save();

  await user.save();
  //deleting old request
  await ResetPasswordToken.deleteMany({ user: user._id });

  logger.info(`user ${user.email} changes his password successfully`);

  return res.status(200).json({
    isChanged: true,
    message: messages["auth.password.changed.successfully"]
  });
});

export const changeUserEmail = catchAsync(async (req, res, next) => {
  const { oldEmail, newEmail } = req.body;
  if (!oldEmail || !newEmail)
    return next(
      new AppError(
        "Vous pouvez pas changer l'email du l'utilisateur sans l'ancien adresse email",
        401
      )
    );
  const user = await getUserByEmail(oldEmail, false);
  if (!user) return next(new AppError(messages["user_not_found_1"], 400));
  const isValid = await User.findOne({ email: newEmail });
  if (isValid) return next(new AppError("email existant", 400));
  user.email = newEmail;
  const token = await createPasswordSetToken();
  user.token = token;
  user.password = null;
  await user.save();
  //sending
  if (user.token) {
    logger.info(`sending email confirmation for user ${user.id}`);
    const url = `http://${config.lms_host}/auth/account/confirmation/${user.token}`;
    try {
      await send({
        template: "account_verification_token",
        to: user.email,
        subject: `Account Verification Link (valid for ${
          config.verify_token_expires_in / 60000
        } min)`,
        args: { url }
      });
    } catch (error) {
      console.log(error);
    }
  }
  return res.status(200).json({ message: messages["email_sent"] });
});

export const checkUserPassword = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const currentPassword = req.body.currentPassword;
  if (!currentPassword)
    return next(new AppError(messages["no_password_specified"], 400));

  const user = await User.findOne({
    where: { email: req.user.email },

    attributes: ["password", "email"]
  });
  if (!user) return next(new UnAuthorized());

  // check if the current  password is true
  const isPasswordMatch = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordMatch)
    return res.status(403).json({
      matched: false,
      message: messages["current_password_does_not_match"]
    });

  return res
    .status(200)
    .json({ matched: true, message: messages["current_password_is_true"] });
});

export const sendResetPasswordEmailToken = catchAsync(
  async (req, res, next) => {
    const { email } = req.body;
    const user = await getUserByEmail(email, false);
    if (!user) return next(new ElementNotFound(messages["email_not_found"]));

    //checking if the user has generated the maximum number of emails :
    const tokens = await ResetPasswordToken.find({
      user: user._id
    }).exec();
    const count = tokens.length;
    if (count >= config.reset_password_request_limit) {
      logger.error(
        `user ${user.id} has exceeded the limit of password reset request: number of requests ${count}`
      );
      return res
        .status(400)
        .json({ status: "failed", message: messages["exceeded_limit"] });
    }
    //generating token
    const token = await createPasswordSetToken();

    if (!token) return next(new AppError(messages["error_generating_email"]));
    //saving user token
    const passwordResetToken = await ResetPasswordToken.create({
      token: token,
      expiresAt: Date.now() + 1 * config.reset_password_token_expires_in,
      user: user.id
    });
    if (!passwordResetToken)
      return next(new AppError(messages["error_generating_email"]));
    //expiring old tokens
    // console.log(rows);
    tokens?.forEach((oldToken) => {
      oldToken.expired = true;
      oldToken.save();
    });
    // sending email

    try {
      const url = `http://${config.lms_host}/reset-password/request/token/${passwordResetToken.token}`;
      await send({
        template: "reset_password_email",
        to: user.email,
        subject: `Reset Password`,
        args: { url }
      });
    } catch (error) {
      logger.error(error);
      return next(new AppError(messages["email_not_sent"], 500));
    }
    return res.status(200).json({
      status: "success",
      message: messages["reset_password_email_sent"]
    });
  }
);

export const resetPasswordTokenVerify = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) return next(new UnAuthorized(messages["no_token_supplied"]));

  const isValidToken = /^[a-zA-Z0-9+/]+={0,2}$/.test(token);

  if (!isValidToken)
    return next(new MalformedObjectId(messages["token_may_be_malformed"]));

  const resetReq = await ResetPasswordToken.findOne({ token });

  if (!resetReq)
    return next(new ElementNotFound(messages["reset_password_page.not_noted"]));

  if (resetReq.expired)
    return next(new UnAuthorized(messages["request_already_fulfilled"]));

  const currentTimeInSameTimezone = new Date().getTime();

  if (resetReq.expiresAt.getTime() < currentTimeInSameTimezone)
    return next(new UnAuthorized(messages["expired_link"]));

  // resetReq.expired =true

  // expiring old tokens  before saving

  const oldTokens = await ResetPasswordToken.find()
    .where("_id")
    .ne(resetReq.id);

  for (var old of oldTokens) {
    old.expired = true;
    await old.save();
  }

  // resetReq.save()

  return res
    .status(200)
    .json({ status: true, message: messages["verified_token"] });
});
