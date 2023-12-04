import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import {
  AppError,
  ElementNotFound,
  MalformedObjectId,
  UnAuthorized,
  UnknownError
} from "../../Utils/appError.js";
import { catchAsync } from "../../Utils/catchAsync.js";
import { config } from "../../environment.config.js";
import logger from "../../log/config.js";
import { send } from "../../mails/config.js";

import ResetPasswordToken from "../../models/users/ResetPasswordToken.model.js";
import User from "../../models/users/User.model.js";
import {
  createPasswordSetToken,
  encryptPassword,
  getUserByEmail,
  serializeUser
} from "../users/lib.js";

export const login = catchAsync(async (req, res, next) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    return next(new ElementNotFound("email ou le mot de passe est incorrect"));
  }
  //maybe adding a blocking detecting algo

  //to manage role redirection later for now static route
  const redirectUrl = "/main";
  if (!user.password)
    return next(
      new UnknownError(
        "ce compte n'est pas actif : veuillez vous référer à votre email pour l'email d'activation"
      )
    );

  const isPasswordMatch = bcrypt.compareSync(req.body.password, user.password);
  if (user && isPasswordMatch) {
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

    return res.status(200).json({
      message: "You have successfully logged in",
      token: `Bearer ${token}`,
      expiresIn: "2d",
      redirectUrl: redirectUrl
    });
  } else {
    return res.status(401).json({
      message: "Invalid email or password",
      success: false
    });
  }
});

export const setUserPassword = catchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError("something went wrong", 500));

  const { isReseted, user } = await resetUserPassword(req, res);

  if (!isReseted || !user) return next(new UnknownError("something wen wrong"));

  user.token = null;
  user.active = true;

  user.save();
  return res.status(200).json({
    status: "success",
    message: "user password has been set and account activated"
  });
});

const resetUserPassword = async (req, res, userEmail = null) => {
  try {
    let response = {
      isReseted: null,
      user: null
    };
    const { password, confirmPassword } = req.body;
    const email = req.body.email || userEmail;

    const user = await User.findOne({
      where: { email: email, isBanned: false }
    });

    if (!user) {
      logger.error("user was not found ", email);
      return response;
    }

    if (!email || !password || !confirmPassword) {
      logger.error("one of the parameters is not found");
      return response;
    }
    if (password !== confirmPassword) {
      logger.error("password doesn't match ");
      return response;
    }

    const encrypted = await encryptPassword(password);
    user.password = encrypted;
    // console.log("user password", encrypted);
    // const
    response.isReseted = true;
    response.user = user;

    return response;
  } catch (error) {
    logger.error(error);
  }
  // if (password )
};

/* @DESC
  function to reset password : this will only work if the user is authenticated otherwise refer to passwordResetWithToken function
*/
export const passwordReset = catchAsync(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword)
    return next(new MissingParameter("passwords don't match "));

  if (password !== confirmPassword)
    return next(new AppError("passwords don't match", 500));

  const { user, isReseted } = await resetUserPassword(req, res, req.user.email);

  if (!user || !isReseted)
    return next(new UnknownError("something went wrong"));

  user.save();
  logger.info(`user ${req.user.email} changes his password successfully`);

  return res
    .status(200)
    .json({ isChanged: true, message: "password changed  successfully" });
});
export const passwordResetWithToken = catchAsync(async (req, res, next) => {
  const { password, confirmPassword, token } = req.body;

  // verify the token
  const resetReq = await ResetPasswordToken.findOne({
    where: { token },
    include: [
      {
        model: User,
        attributes: ["email", "id"]
      }
    ]
  });
  // console.log(resetReq.user.email);
  if (!resetReq)
    return next(
      new ElementNotFound(
        "It seems that we didn't note this request. you can generate another request with the reset password page"
      )
    );

  if (resetReq.expired)
    return next(
      new UnAuthorized(
        "This request is already fulfilled. If you find something wrong with this you can try again or contact the admin"
      )
    );

  const currentTimeInSameTimezone = new Date().getTime();
  console.log(
    resetReq.expiresAt.getTime(),
    "Date now",
    currentTimeInSameTimezone,
    " res =>",
    resetReq.expiresAt.getTime() > currentTimeInSameTimezone
  );
  if (resetReq.expiresAt.getTime() < currentTimeInSameTimezone)
    return next(
      new UnAuthorized(
        "This link has already expired. If you find something wrong with this you can try again or contact the admin"
      )
    );

  resetReq.expired = true;

  if (!password || !confirmPassword)
    return next(new MissingParameter("passwords don't match "));

  if (password !== confirmPassword)
    return next(new AppError("passwords don't match", 500));

  const { user, isReseted } = await resetUserPassword(
    req,
    res,
    resetReq.user.email
  );

  if (!user || !isReseted)
    return next(new UnknownError("something went wrong"));

  resetReq.save();

  user.save();
  //deleting old request
  await ResetPasswordToken.destroy({ where: { id: user.id } });
  logger.info(`user ${user.email} changes his password successfully`);

  return res
    .status(200)
    .json({ isChanged: true, message: "password changed  successfully" });
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
  const user = await User.findOne({ where: { email: oldEmail } });
  if (!user) return next(new AppError("utilisateur introuvable", 400));
  const isValid = await User.findOne({ where: { email: newEmail } });
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
  return res
    .status(200)
    .json({ message: "email  a été modifiée et lui envoyer un email" });
});

export const checkUserPassword = catchAsync(async (req, res, next) => {
  // console.log(req.body);
  const currentPassword = req.body.currentPassword;
  if (!currentPassword)
    return next(new AppError("no password has been specified", 400));

  const user = await User.findOne({
    where: { email: req.user.email },

    attributes: ["password", "email"]
  });
  if (!user) return next(new UnAuthorized());

  // check if the current  password is true
  const isPasswordMatch = bcrypt.compareSync(currentPassword, user.password);
  if (!isPasswordMatch)
    return res
      .status(403)
      .json({ matched: false, message: "current password doesn't match" });

  return res
    .status(200)
    .json({ matched: true, message: "current password is true" });
});

export const sendResetPasswordEmailToken = catchAsync(
  async (req, res, next) => {
    const { email } = req.body;
    const user = await getUserByEmail(email, false);

    if (!user) return next(new ElementNotFound("This email doesn't exist"));

    //checking if the user has generated the maximum number of emails :
    const { rows, count } = await ResetPasswordToken.findAndCountAll({
      where: {
        userID: user.id
      }
    });

    if (count >= config.reset_password_request_limit) {
      logger.error(
        `user ${user.id} has exceeded the limit of password reset request: number of requests ${count}`
      );
      return res
        .status(400)
        .json({ status: "failed", message: "you've exceeded the limit " });
    }
    //generating token
    const token = await createPasswordSetToken();
    if (!token)
      return next(new AppError("something went wrong when generating email"));
    //saving user token
    const passwordResetToken = await ResetPasswordToken.create({
      token: token,
      expiresAt: Date.now() + 1 * config.reset_password_token_expires_in,
      userID: user.id
    });
    if (!passwordResetToken)
      return next(new AppError("something went wrong when generating email"));
    //expiring old tokens
    // console.log(rows);
    rows?.forEach((oldToken) => {
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
      return next(
        new AppError("we couldn't send the email! please try again later", 500)
      );
    }
    return res.status(200).json({
      status: "success",
      message: "a reset password email has been sent"
    });
  }
);

export const resetPasswordTokenVerify = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) return next(new UnAuthorized("there is no token supplied"));

  const isValidToken = /^[a-zA-Z0-9+/]+={0,2}$/.test(token);

  if (!isValidToken)
    return next(new MalformedObjectId("token maybe malformed"));

  const resetReq = await ResetPasswordToken.findOne({ where: { token } });

  if (!resetReq)
    return next(
      new ElementNotFound(
        "It seems that we didn't note this request. you can generate another request with the reset password page"
      )
    );

  if (resetReq.expired)
    return next(
      new UnAuthorized(
        "This request is already fulfilled. If you find something wrong with this you can try again or contact the admin"
      )
    );

  const currentTimeInSameTimezone = new Date().getTime();

  if (resetReq.expiresAt.getTime() < currentTimeInSameTimezone)
    return next(
      new UnAuthorized(
        "This link has already expired. If you find something wrong with this you can try again or contact the admin"
      )
    );

  // resetReq.expired =true

  // expiring old tokens  before saving
  const oldTokens = await ResetPasswordToken.findAll({
    where: {
      id: {
        [Op.not]: resetReq.id
      }
    }
  });

  oldTokens?.forEach((old) => {
    old.expired = true;
    old.save();
  });

  // resetReq.save()

  return res
    .status(200)
    .json({ status: true, message: "this token is verified" });
});
